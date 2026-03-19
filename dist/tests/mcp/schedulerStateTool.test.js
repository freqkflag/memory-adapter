import { describe, expect, it } from "vitest";
import { TOOL_DEFINITIONS } from "../../mcp/tools.js";
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
describe("get_scheduler_state tool", () => {
    it("returns numeric scheduler state values only", async () => {
        const now = Date.now();
        const memories = [
            makeEmotionMemory("e1", "valence:0.4,arousal:0.3,tension:0.5,social:0.2", now - 5000),
            makeEmotionMemory("e2", "valence:0.5,arousal:0.2,tension:0.4,social:0.4", now - 4000),
            makeEmotionMemory("e3", "valence:0.2,arousal:0.6,tension:0.7,social:0.1", now - 3000)
        ];
        const def = TOOL_DEFINITIONS.find((d) => d.name === "get_scheduler_state");
        expect(def).toBeDefined();
        const coordinator = {
            getAllMemories: () => memories
        };
        const result = await def.handler(coordinator, {});
        expect(typeof result.strainScore).toBe("number");
        expect(typeof result.volatilityScore).toBe("number");
        expect(typeof result.stabilityScore).toBe("number");
        expect(typeof result.confidence).toBe("number");
        expect(typeof result.sampleCount).toBe("number");
        expect(result.strainScore).toBeGreaterThanOrEqual(0);
        expect(result.strainScore).toBeLessThanOrEqual(1);
        expect(result.volatilityScore).toBeGreaterThanOrEqual(0);
        expect(result.volatilityScore).toBeLessThanOrEqual(1);
        expect(result.stabilityScore).toBeGreaterThanOrEqual(0);
        expect(result.stabilityScore).toBeLessThanOrEqual(1);
    });
});
