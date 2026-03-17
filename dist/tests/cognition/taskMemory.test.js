import { describe, it, expect } from "vitest";
import { TaskMemory } from "../../core/cognition/taskMemory.js";
describe("TaskMemory", () => {
    it("registers tasks and links them to memories", () => {
        const tm = new TaskMemory();
        tm.registerTask({
            id: "task-1",
            description: "Test task",
            status: "pending",
            createdAt: Date.now(),
            domain: "projects"
        });
        tm.linkTaskToMemory("task-1", "mem-1");
        tm.linkTaskToMemory("task-1", "mem-2");
        expect(tm.getTask("task-1")?.description).toBe("Test task");
        expect(tm.getMemoriesForTask("task-1")).toEqual(expect.arrayContaining(["mem-1", "mem-2"]));
        expect(tm.getTasksForMemory("mem-1")).toContain("task-1");
    });
});
