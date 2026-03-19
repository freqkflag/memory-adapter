import { describe, expect, it } from "vitest";
import { deriveSchedulerStateFromMemories, getNeutralSchedulerState } from "../../core/cognition/schedulerState.js";
function makeEmotionMemory(id, text, timestamp) {
    return {
        id,
        text,
        domain: "emotion",
        durability: "normal",
        sectionPath: [],
        tags: [],
        strength: 0.5,
        importance: 0.5,
        accessCount: 0,
        createdBy: "test",
        updatedBy: "test",
        version: 1,
        timestamp
    };
}
describe("schedulerState", () => {
    it("returns neutral fallback when no E-Lang memory exists", () => {
        const state = deriveSchedulerStateFromMemories([]);
        expect(state).toEqual(getNeutralSchedulerState());
    });
    it("derives bounded numeric scheduler state from recent vectors", () => {
        const now = Date.now();
        const memories = [
            makeEmotionMemory("m1", "valence:0.1,arousal:0.2,tension:0.6,social:0.2", now - 5000),
            makeEmotionMemory("m2", "valence:0.2,arousal:0.4,tension:0.5,social:0.3", now - 4000),
            makeEmotionMemory("m3", "valence:0.3,arousal:0.1,tension:0.7,social:0.1", now - 3000),
            makeEmotionMemory("m4", "valence:0.5,arousal:0.2,tension:0.4,social:0.4", now - 2000)
        ];
        const state = deriveSchedulerStateFromMemories(memories);
        expect(state.sampleCount).toBeGreaterThanOrEqual(3);
        expect(state.strainScore).toBeGreaterThanOrEqual(0);
        expect(state.strainScore).toBeLessThanOrEqual(1);
        expect(state.volatilityScore).toBeGreaterThanOrEqual(0);
        expect(state.volatilityScore).toBeLessThanOrEqual(1);
        expect(state.stabilityScore).toBeGreaterThanOrEqual(0);
        expect(state.stabilityScore).toBeLessThanOrEqual(1);
        expect(state.confidence).toBeGreaterThan(0);
        expect(state.confidence).toBeLessThanOrEqual(1);
    });
});
