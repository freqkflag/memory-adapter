import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { decomposeGoal, Task } from "../planning/taskPlanner.js";
import { AgentRole } from "../planning/agentRoles.js";
import { now } from "../utils/time.js";

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
}

