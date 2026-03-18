import { goalMemory, type Goal } from "./goalMemory.js";

export interface RankedGoal extends Goal {
  priorityScore: number;
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function computePriority(goal: Goal): number {
  const now = Date.now();

  const updatedAt = typeof goal.updatedAt === "number" ? goal.updatedAt : 0;
  const baseRecency = now - updatedAt <= DAY_MS ? 2 : 1;

  const importanceWeight = goal.importance ?? 1;
  const urgencyWeight = goal.urgency ?? 1;

  let dueSoonWeight = 0;
  if (typeof goal.dueAt === "number" && Number.isFinite(goal.dueAt)) {
    const diff = goal.dueAt - now;
    if (diff < 0) dueSoonWeight = 3;
    else if (diff <= DAY_MS) dueSoonWeight = 2;
    else if (diff <= 3 * DAY_MS) dueSoonWeight = 1;
  }

  const iterations = typeof goal.iterations === "number" ? goal.iterations : 0;
  const iterationPenalty = iterations * 0.5;

  const scheduledAt = typeof goal.scheduledAt === "number" ? goal.scheduledAt : undefined;
  const recentlyScheduledPenalty =
    scheduledAt !== undefined && now - scheduledAt <= 12 * HOUR_MS ? 1 : 0;

  const pausedPenalty = goal.status === "paused" ? 2 : 0;

  return (
    baseRecency +
    importanceWeight +
    urgencyWeight +
    dueSoonWeight -
    iterationPenalty -
    recentlyScheduledPenalty -
    pausedPenalty
  );
}

export class GoalScheduler {
  async getPrioritizedGoals(): Promise<RankedGoal[]> {
    const runnable = await goalMemory.getRunnable();
    const now = Date.now();

    return runnable
      .map((g) => {
        const priorityScore = computePriority(g);
        return { ...g, priorityScore };
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

  async getNextGoal(): Promise<RankedGoal | null> {
    const prioritized = await this.getPrioritizedGoals();
    return prioritized[0] ?? null;
  }

  async scheduleNext(): Promise<{ goal: RankedGoal; scheduledAt: number } | null> {
    const next = await this.getNextGoal();
    if (!next) return null;

    const scheduledAt = Date.now();
    const updated = await goalMemory.update(next.id, {
      scheduledAt,
      lastEvaluated: scheduledAt
    });

    if (!updated) return null;

    const priorityScore = computePriority(updated);
    return {
      goal: { ...updated, priorityScore },
      scheduledAt
    };
  }
}

