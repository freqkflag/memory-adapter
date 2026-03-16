import { describe, it, expect } from "vitest";
import { summarizeEmotionalDrift } from "../../reflection/emotionalDriftHelper.js";
describe("emotionalDriftHelper", () => {
    it("summarizes emotional drift over last N events", async () => {
        const baseTime = Date.now();
        const events = [
            { axes: { calm: 0.2 }, timestamp: baseTime - 3000, source: "user" },
            { axes: { calm: 0.4 }, timestamp: baseTime - 2000, source: "user" },
            { axes: { calm: 0.5 }, timestamp: baseTime - 1000, source: "user" }
        ];
        const result = await summarizeEmotionalDrift(events, 3);
        expect(result.drift.count).toBe(3);
        expect(result.summary).toContain("Emotional drift over last");
        expect(result.summary).toContain("Axis 'calm'");
    });
    it("handles no data", async () => {
        const result = await summarizeEmotionalDrift([], 5);
        expect(result.drift.count).toBe(0);
        expect(result.summary).toContain("No emotional trajectory data");
    });
});
