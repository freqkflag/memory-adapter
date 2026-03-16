import { Task } from "./agentRoles";
import { generateId } from "../utils/ids";

export class TaskPlanner {
  decompose(goal: string): Task {
    const root: Task = {
      id: generateId("task"),
      goal,
      subtasks: [],
      status: "pending"
    };
    if (goal.toLowerCase().includes("research")) {
      root.subtasks.push(
        {
          id: generateId("task"),
          goal: "retrieve relevant memories",
          subtasks: [],
          assignedAgent: "retrieverAgent",
          status: "pending"
        },
        {
          id: generateId("task"),
          goal: "draft summary",
          subtasks: [],
          assignedAgent: "writerAgent",
          status: "pending",
          dependencies: []
        }
      );
    }
    return root;
  }
}

