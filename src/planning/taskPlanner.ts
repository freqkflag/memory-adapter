import { AgentRole } from "./agentRoles";
import { generateId } from "../utils/ids";

export type TaskStatus = "pending" | "running" | "done";

export interface Task {
  id: string;
  goal: string;
  subtasks: Task[];
  assignedAgent?: AgentRole | string;
  dependencies?: string[];
  status: TaskStatus;
}

export function createRootTask(goal: string): Task {
  return {
    id: generateId("task"),
    goal,
    subtasks: [],
    status: "pending"
  };
}

export function decomposeGoal(goal: string, roles: AgentRole[]): Task {
  const root = createRootTask(goal);
  root.subtasks = roles.map((role) => ({
    id: generateId("task"),
    goal: `${goal} (${role})`,
    subtasks: [],
    assignedAgent: role,
    status: "pending"
  }));
  return root;
}

