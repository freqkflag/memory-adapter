import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { decomposeGoal, Task } from "../planning/taskPlanner.js";
import { AgentRole } from "../planning/agentRoles.js";
import { now } from "../utils/time.js";
import { generatePlan, executePlan } from "../core/planning/dynamicPlanner.js";
import { runAdaptivePlan } from "../core/planning/adaptivePlanner.js";
import { goalMemory } from "../core/cognition/goalMemory.js";

export class PlannerAgent {
  readonly id = "planner";
  readonly name = "Planner Agent";
  readonly type: AgentRole = "plannerAgent";

  constructor(private coordinator: CognitionCoordinator) {}

  async plan(goal: string): Promise<Task> {
    const task = decomposeGoal(goal, [
      "retrieverAgent",
      "writerAgent",
      "reflectionAgent",
      "predictionAgent",
      "verificationAgent",
      "systemIntrospectionAgent"
    ]);
    await this.coordinator.logOperation({
      agentId: this.id,
      action: "create_plan",
      payload: { goal, task }
    });
    this.coordinator.registerTask({
      id: task.id,
      description: task.goal,
      status: task.status === "done" ? "completed" : task.status === "running" ? "in_progress" : "pending",
      createdAt: now(),
      domain: "projects"
    });
    return task;
  }

  async autoPlan(goal: string, tools: any) {
    const plan = generatePlan(goal);
    const executionResults = await executePlan(plan, tools);

    await this.coordinator.logOperation({
      agentId: this.id,
      action: "auto_plan",
      payload: { goal, plan, executionResults }
    });

    return { plan, executionResults };
  }

  async adaptivePlan(goal: string, tools: any) {
    const existing = await goalMemory.findByText(goal);
    const goalId = existing?.id ?? `goal-${Date.now()}`;
    const storedGoal = existing ?? (await goalMemory.add({ id: goalId, goal }));

    const result = await runAdaptivePlan(goal, tools, 3, goalMemory, storedGoal.id);

    await this.coordinator.logOperation({
      agentId: this.id,
      action: "adaptive_plan",
      payload: { goal: storedGoal.goal, goalId: storedGoal.id, iterations: result.iterations.length }
    });

    return result;
  }

  async resumeGoal(goalId: string, tools: any) {
    const stored = await goalMemory.get(goalId);
    if (!stored) {
      return { ok: false, error: "Goal not found" };
    }
    if (stored.status === "completed" || stored.status === "failed") {
      return { ok: false, error: `Goal is already ${stored.status}` };
    }

    const result = await runAdaptivePlan(stored.goal, tools, 3, goalMemory, stored.id);

    await this.coordinator.logOperation({
      agentId: this.id,
      action: "resume_goal",
      payload: { goalId: stored.id, iterations: result.iterations.length }
    });

    return result;
  }
}

