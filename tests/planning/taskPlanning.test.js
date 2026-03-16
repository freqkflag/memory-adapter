import { describe, it, expect } from "vitest";
import { decomposeGoal } from "../../src/planning/taskPlanner";
describe("Task Planning", () => {
    it("decomposes goals across agent roles", () => {
        const root = decomposeGoal("Test goal", [
            "retrieverAgent",
            "writerAgent",
            "reflectionAgent",
            "predictionAgent",
            "verificationAgent"
        ]);
        expect(root.subtasks.length).toBe(5);
        expect(root.subtasks.map((t) => t.assignedAgent)).toContain("retrieverAgent");
    });
});
