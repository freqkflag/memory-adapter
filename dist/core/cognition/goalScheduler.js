import { goalMemory } from "./goalMemory.js";
import { getNeutralSchedulerState, loadSchedulerStateFromRecentEmotion } from "./schedulerState.js";
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const EPSILON = 1e-9;
function clamp(value, min, max) {
    if (!Number.isFinite(value))
        return min;
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
function computeBasePriority(goal) {
    const now = Date.now();
    const updatedAt = typeof goal.updatedAt === "number" ? goal.updatedAt : 0;
    const baseRecency = now - updatedAt <= DAY_MS ? 2 : 1;
    const importanceWeight = goal.importance ?? 1;
    const urgencyWeight = goal.urgency ?? 1;
    let dueSoonWeight = 0;
    if (typeof goal.dueAt === "number" && Number.isFinite(goal.dueAt)) {
        const diff = goal.dueAt - now;
        if (diff < 0)
            dueSoonWeight = 3;
        else if (diff <= DAY_MS)
            dueSoonWeight = 2;
        else if (diff <= 3 * DAY_MS)
            dueSoonWeight = 1;
    }
    const iterations = typeof goal.iterations === "number" ? goal.iterations : 0;
    const iterationPenalty = iterations * 0.5;
    const scheduledAt = typeof goal.scheduledAt === "number" ? goal.scheduledAt : undefined;
    const recentlyScheduledPenalty = scheduledAt !== undefined && now - scheduledAt <= 12 * HOUR_MS ? 1 : 0;
    const pausedPenalty = goal.status === "paused" ? 2 : 0;
    return (baseRecency +
        importanceWeight +
        urgencyWeight +
        dueSoonWeight -
        iterationPenalty -
        recentlyScheduledPenalty -
        pausedPenalty);
}
function computeGoalLoad(goal) {
    const values = [goal.energyCost, goal.focusCost, goal.emotionalLoad, goal.cognitiveLoad].filter((v) => typeof v === "number" && Number.isFinite(v));
    if (values.length === 0)
        return 1;
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    return clamp(avg, 0, 5);
}
function computeDeepWorkFactor(goal) {
    const candidates = [goal.focusCost, goal.cognitiveLoad, goal.energyCost].filter((v) => typeof v === "number" && Number.isFinite(v));
    if (candidates.length === 0)
        return 0;
    const load = Math.max(...candidates);
    return clamp((load - 1.5) / 3.5, 0, 1);
}
export function computeEnergyAwareAdjustment(goal, state) {
    if (state.confidence <= EPSILON || state.sampleCount <= 0)
        return 0;
    const load = computeGoalLoad(goal);
    const normalizedLoad = clamp(load / 5, 0, 1);
    const deepWorkFactor = computeDeepWorkFactor(goal);
    const strainPressure = clamp(0.65 * state.strainScore + 0.35 * state.volatilityScore, 0, 1);
    const penalty = strainPressure * normalizedLoad * 2.4;
    const stabilityBoost = state.stabilityScore * deepWorkFactor * 1.1;
    const raw = (stabilityBoost - penalty) * state.confidence;
    return clamp(raw, -2.5, 1.25);
}
export class GoalScheduler {
    async getPrioritizedGoals() {
        const runnable = await goalMemory.getRunnable();
        const schedulerState = await loadSchedulerStateFromRecentEmotion().catch(() => getNeutralSchedulerState());
        return runnable
            .map((g) => {
            const base = computeBasePriority(g);
            const adjustmentApplied = computeEnergyAwareAdjustment(g, schedulerState);
            const priorityScore = base + adjustmentApplied;
            return {
                ...g,
                priorityScore,
                schedulerContext: {
                    strainScore: schedulerState.strainScore,
                    volatilityScore: schedulerState.volatilityScore,
                    stabilityScore: schedulerState.stabilityScore,
                    adjustmentApplied
                }
            };
        })
            .sort((a, b) => {
            if (b.priorityScore !== a.priorityScore) {
                return b.priorityScore - a.priorityScore;
            }
            const aUpdated = typeof a.updatedAt === "number" ? a.updatedAt : 0;
            const bUpdated = typeof b.updatedAt === "number" ? b.updatedAt : 0;
            return bUpdated - aUpdated;
        });
    }
    async getNextGoal() {
        const prioritized = await this.getPrioritizedGoals();
        return prioritized[0] ?? null;
    }
    async scheduleNext() {
        const next = await this.getNextGoal();
        if (!next)
            return null;
        const scheduledAt = Date.now();
        const updated = await goalMemory.update(next.id, {
            scheduledAt,
            lastEvaluated: scheduledAt
        });
        if (!updated)
            return null;
        const schedulerState = await loadSchedulerStateFromRecentEmotion().catch(() => getNeutralSchedulerState());
        const adjustmentApplied = computeEnergyAwareAdjustment(updated, schedulerState);
        const priorityScore = computeBasePriority(updated) + adjustmentApplied;
        return {
            goal: {
                ...updated,
                priorityScore,
                schedulerContext: {
                    strainScore: schedulerState.strainScore,
                    volatilityScore: schedulerState.volatilityScore,
                    stabilityScore: schedulerState.stabilityScore,
                    adjustmentApplied
                }
            },
            scheduledAt
        };
    }
}
