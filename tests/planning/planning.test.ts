import { describe, it, expect } from "vitest";
import { TaskPlanner } from "../../../src/planning/taskPlanner";
import { TaskExecutor } from "../../../src/planning/taskExecutor";

describe("Task planning", () => {
  it("decomposes goals into subtasks", () => {
    const planner = new TaskPlanner();
    const root = planner.decompose("research tattoo ideas");
    expect(root.subtasks.length).toBeGreaterThan(0);
  });

  it("tracks task status and pending tasks", () => {
    const planner = new TaskPlanner();
    const root = planner.decompose("research tattoo ideas");
    const executor = new TaskExecutor();
    const pending = executor.listPending(root);
    expect(pending.length).toBeGreaterThan(0);
    executor.updateStatus(pending[0], "done");
    const after = executor.listPending(root);
    expect(after.length).toBeLessThan(pending.length);
  });
});

