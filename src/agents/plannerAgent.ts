import { CognitionCoordinator } from "../cognition/cognitionCoordinator";
import { decomposeGoal, Task } from "../planning/taskPlanner";
import { AgentRole } from "../planning/agentRoles";

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
    return task;
  }
}

