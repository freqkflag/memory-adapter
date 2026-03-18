import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

vi.mock("../../src/agents/plannerAgent.js", () => {
  return {
    PlannerAgent: class PlannerAgentMock {
      constructor(_coordinator: any) {}
      resumeGoal(goalId: string, toolMap: Record<string, any>) {
        return Promise.resolve({
          ok: true,
          goalId,
          toolMapKeys: Object.keys(toolMap)
        });
      }
    }
  };
});

describe("GoalScheduler + goal tools", () => {
  const originalCwd = process.cwd();
  let tmpDir: string | null = null;

  beforeEach(() => {
    vi.resetModules();

    tmpDir = mkdtempSync(path.join(os.tmpdir(), "pam-goals-"));
    process.chdir(tmpDir);
    mkdirSync("memory", { recursive: true });
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (tmpDir) rmSync(tmpDir, { recursive: true, force: true });
    tmpDir = null;
    vi.useRealTimers();
  });

  function writeGoals(goals: any[]) {
    const lines = goals.map((g) => `- ${JSON.stringify(g)}`);
    writeFileSync(
      path.join("memory", "goals.md"),
      lines.join("\n") + "\n",
      "utf8"
    );
  }

  async function loadScheduler() {
    const mod = await import("../../src/core/cognition/goalScheduler.js");
    return mod.GoalScheduler as any;
  }

  async function loadGoalMemory() {
    const mod = await import("../../src/core/cognition/goalMemory.js");
    return mod.goalMemory as any;
  }

  async function loadTools() {
    const mod = await import("../../src/mcp/tools.js");
    return mod.TOOL_DEFINITIONS as any[];
  }

  it("prioritizes by recency and weights", async () => {
    vi.useFakeTimers();
    const now = 1_700_000_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "g-recent",
        goal: "Recent",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 1 * 60 * 60 * 1000,
        iterations: 0
      },
      {
        id: "g-old",
        goal: "Old",
        status: "active",
        createdAt: now - 2 * 24 * 60 * 60 * 1000,
        updatedAt: now - 30 * 60 * 60 * 1000,
        iterations: 0
      }
    ]);

    const GoalScheduler = await loadScheduler();
    const scheduler = new GoalScheduler();

    const next = await scheduler.getNextGoal();
    expect(next?.id).toBe("g-recent");
  });

  it("paused goals rank lower than active goals", async () => {
    vi.useFakeTimers();
    const now = 1_700_100_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "g-active",
        goal: "Active",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 1 * 60 * 60 * 1000,
        iterations: 0
      },
      {
        id: "g-paused",
        goal: "Paused",
        status: "paused",
        createdAt: now - 10_000,
        updatedAt: now - 1 * 60 * 60 * 1000,
        iterations: 0
      }
    ]);

    const GoalScheduler = await loadScheduler();
    const scheduler = new GoalScheduler();

    const next = await scheduler.getNextGoal();
    expect(next?.id).toBe("g-active");
  });

  it("excludes completed goals from runnable set", async () => {
    vi.useFakeTimers();
    const now = 1_700_200_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "g-complete",
        goal: "Complete",
        status: "completed",
        createdAt: now - 10_000,
        updatedAt: now - 1 * 60 * 60 * 1000,
        iterations: 0,
        dueAt: now - 60_000
      },
      {
        id: "g-active",
        goal: "Active",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 2 * 24 * 60 * 60 * 1000,
        iterations: 0
      }
    ]);

    const GoalScheduler = await loadScheduler();
    const scheduler = new GoalScheduler();

    const prioritized = await scheduler.getPrioritizedGoals();
    expect(prioritized.map((g) => g.id)).not.toContain("g-complete");
    expect(await scheduler.getNextGoal()).toEqual(
      expect.objectContaining({ id: "g-active" })
    );
  });

  it("dueAt boosts priority (overdue > due within 24h)", async () => {
    vi.useFakeTimers();
    const now = 1_700_300_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "g-overdue",
        goal: "Overdue",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 1 * 60 * 60 * 1000,
        iterations: 0,
        dueAt: now - 60_000
      },
      {
        id: "g-soon",
        goal: "Soon",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 1 * 60 * 60 * 1000,
        iterations: 0,
        dueAt: now + 2 * 60 * 60 * 1000
      }
    ]);

    const GoalScheduler = await loadScheduler();
    const scheduler = new GoalScheduler();
    const next = await scheduler.getNextGoal();

    expect(next?.id).toBe("g-overdue");
  });

  it("scheduleNext persists scheduledAt + lastEvaluated", async () => {
    vi.useFakeTimers();
    const now = 1_700_400_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "g-next",
        goal: "Next",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 60_000,
        iterations: 0
      }
    ]);

    const GoalScheduler = await loadScheduler();
    const scheduler = new GoalScheduler();
    const scheduled = await scheduler.scheduleNext();

    expect(scheduled).not.toBeNull();
    expect(scheduled?.scheduledAt).toBe(now);

    const goalMemory = await loadGoalMemory();
    const stored = await goalMemory.get("g-next");

    expect(stored?.scheduledAt).toBe(now);
    expect(stored?.lastEvaluated).toBe(now);
  });

  it("handles missing/empty runnable goals safely", async () => {
    vi.useFakeTimers();
    const now = 1_700_500_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "g-complete",
        goal: "Complete",
        status: "completed",
        createdAt: now - 10_000,
        updatedAt: now - 60_000,
        iterations: 0
      }
    ]);

    const GoalScheduler = await loadScheduler();
    const scheduler = new GoalScheduler();

    expect(await scheduler.getNextGoal()).toBeNull();
    expect(await scheduler.scheduleNext()).toBeNull();
  });

  it("MCP tools: prioritize_goals + get_next_goal return ranked goals", async () => {
    vi.useFakeTimers();
    const now = 1_700_600_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "a",
        goal: "A",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 2 * 60 * 60 * 1000,
        iterations: 0
      },
      {
        id: "b",
        goal: "B",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 2 * 24 * 60 * 60 * 1000,
        iterations: 0
      }
    ]);

    const TOOL_DEFINITIONS = await loadTools();
    const prioritize = TOOL_DEFINITIONS.find((d) => d.name === "prioritize_goals");
    const nextTool = TOOL_DEFINITIONS.find((d) => d.name === "get_next_goal");

    const ranked = await prioritize.handler(undefined, {});
    expect(ranked[0].id).toBe("a");

    const next = await nextTool.handler(undefined, {});
    expect(next.id).toBe("a");
  });

  it("MCP tools: schedule_next_goal updates goal metadata and logs operation", async () => {
    vi.useFakeTimers();
    const now = 1_700_700_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "sched",
        goal: "Sched",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 60_000,
        iterations: 0
      }
    ]);

    const fakeCoordinator = {
      logOperation: vi.fn().mockResolvedValue({ ok: true })
    };

    const TOOL_DEFINITIONS = await loadTools();
    const scheduleNextTool = TOOL_DEFINITIONS.find((d) => d.name === "schedule_next_goal");
    const result = await scheduleNextTool.handler(fakeCoordinator, {});

    expect(result?.goal.id).toBe("sched");
    expect(result?.scheduledAt).toBe(now);
    expect(fakeCoordinator.logOperation).toHaveBeenCalled();
    expect(fakeCoordinator.logOperation.mock.calls[0][0]).toMatchObject({
      action: "schedule_next_goal"
    });

    const goalMemory = await loadGoalMemory();
    const stored = await goalMemory.get("sched");
    expect(stored?.scheduledAt).toBe(now);
    expect(stored?.lastEvaluated).toBe(now);
  });

  it("MCP tools: run_next_goal calls PlannerAgent.resumeGoal with a non-recursive toolMap", async () => {
    vi.useFakeTimers();
    const now = 1_700_800_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "run",
        goal: "Run",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 60_000,
        iterations: 0
      }
    ]);

    const fakeCoordinator = {
      logOperation: vi.fn().mockResolvedValue({ ok: true })
    };

    const TOOL_DEFINITIONS = await loadTools();
    const runNextTool = TOOL_DEFINITIONS.find((d) => d.name === "run_next_goal");
    const result = await runNextTool.handler(fakeCoordinator, {});

    expect(result.ok).toBe(true);
    expect(result.goalId).toBe("run");
    expect(result.toolMapKeys).not.toContain("run_next_goal");
    expect(result.toolMapKeys).not.toContain("adaptive_plan");
    expect(fakeCoordinator.logOperation).toHaveBeenCalled();
  });

  it("MCP tools: update_goal updates fields and returns updated goal (or Goal not found)", async () => {
    vi.useFakeTimers();
    const now = 1_700_900_000_000;
    vi.setSystemTime(now);

    writeGoals([
      {
        id: "u1",
        goal: "Update Me",
        status: "active",
        createdAt: now - 10_000,
        updatedAt: now - 60_000,
        iterations: 0
      }
    ]);

    const fakeCoordinator = {
      logOperation: vi.fn().mockResolvedValue({ ok: true })
    };

    const TOOL_DEFINITIONS = await loadTools();
    const updateGoalTool = TOOL_DEFINITIONS.find((d) => d.name === "update_goal");

    const updated = await updateGoalTool.handler(fakeCoordinator, {
      goalId: "u1",
      dueAt: now + 5 * 60 * 60 * 1000,
      importance: 4,
      urgency: 3,
      energyCost: 2,
      status: "paused"
    });

    expect(updated.id).toBe("u1");
    expect(updated.status).toBe("paused");
    expect(updated.dueAt).toBe(now + 5 * 60 * 60 * 1000);
    expect(updated.importance).toBe(4);
    expect(updated.urgency).toBe(3);
    expect(updated.energyCost).toBe(2);

    const missing = await updateGoalTool.handler(fakeCoordinator, {
      goalId: "does-not-exist"
    });
    expect(missing).toEqual({ ok: false, error: "Goal not found" });
  });
});

