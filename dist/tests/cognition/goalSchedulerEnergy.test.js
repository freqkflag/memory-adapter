import { describe, expect, it } from "vitest";
import { computeEnergyAwareAdjustment } from "../../core/cognition/goalScheduler.js";
function makeGoal(overrides = {}) {
    const now = Date.now();
    return {
        id: overrides.id ?? "goal-1",
        goal: overrides.goal ?? "Test goal",
        status: overrides.status ?? "active",
        createdAt: overrides.createdAt ?? now - 5000,
        updatedAt: overrides.updatedAt ?? now - 1000,
        iterations: overrides.iterations ?? 0,
        ...overrides
    };
}
describe("goalScheduler energy-aware scoring", () => {
    it("reduces high-load goal priority under high strain", () => {
        const state = {
            strainScore: 0.95,
            volatilityScore: 0.9,
            stabilityScore: 0.1,
            confidence: 1,
            sampleCount: 8
        };
        const highLoad = makeGoal({ energyCost: 5, emotionalLoad: 5, cognitiveLoad: 5 });
        const lightLoad = makeGoal({ energyCost: 1, emotionalLoad: 1, cognitiveLoad: 1 });
        const highAdj = computeEnergyAwareAdjustment(highLoad, state);
        const lightAdj = computeEnergyAwareAdjustment(lightLoad, state);
        expect(highAdj).toBeLessThan(lightAdj);
        expect(highAdj).toBeLessThan(0);
    });
    it("slightly boosts deep-work goals during stable state", () => {
        const state = {
            strainScore: 0.2,
            volatilityScore: 0.1,
            stabilityScore: 0.9,
            confidence: 1,
            sampleCount: 10
        };
        const deepWork = makeGoal({ focusCost: 5, cognitiveLoad: 5, energyCost: 4 });
        const quickTask = makeGoal({ focusCost: 1, cognitiveLoad: 1, energyCost: 1 });
        const deepAdj = computeEnergyAwareAdjustment(deepWork, state);
        const quickAdj = computeEnergyAwareAdjustment(quickTask, state);
        expect(deepAdj).toBeGreaterThan(0);
        expect(deepAdj).toBeGreaterThan(quickAdj);
    });
    it("keeps old goals without hints runnable", () => {
        const state = {
            strainScore: 0.7,
            volatilityScore: 0.7,
            stabilityScore: 0.3,
            confidence: 1,
            sampleCount: 5
        };
        const legacyGoal = makeGoal({});
        const adjustment = computeEnergyAwareAdjustment(legacyGoal, state);
        expect(Number.isFinite(adjustment)).toBe(true);
    });
});
