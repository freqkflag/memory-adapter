import { describe, it, expect } from "vitest";
import { generatePredictions, isPredictionActive } from "../../src/prediction/predictionEngine";
describe("Prediction Engine", () => {
    const base = {
        text: "",
        domain: "projects",
        durability: "normal",
        sectionPath: [],
        tags: [],
        strength: 0.5,
        importance: 0.5,
        accessCount: 0,
        createdBy: "test",
        updatedBy: "test",
        version: 1,
        timestamp: Date.now()
    };
    it("generates time-bounded predictions", () => {
        const memories = [
            { ...base, id: "p1", text: "Working on projects frequently." },
            { ...base, id: "p2", text: "Another project-focused memory." }
        ];
        const predictions = generatePredictions(memories);
        if (predictions.length > 0) {
            const p = predictions[0];
            expect(isPredictionActive(p)).toBe(true);
            expect(p.expiresAt).toBeDefined();
            expect(p.expiresAt > p.createdAt).toBe(true);
        }
    });
});
