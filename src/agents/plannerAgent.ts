import { TaskPlanner } from "../planning/taskPlanner";
import { Task } from "../planning/agentRoles";

export class PlannerAgent {
  readonly id = "plannerAgent";
  readonly name = "Planner Agent";
  readonly type = "plannerAgent";

  constructor(private readonly planner = new TaskPlanner()) {}

  plan(goal: string): Task {
    return this.planner.decompose(goal);
  }
}

