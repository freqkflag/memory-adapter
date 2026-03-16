export type TaskStatus = "pending" | "running" | "done";

export interface Task {
  id: string;
  goal: string;
  subtasks: Task[];
  assignedAgent?: string;
  dependencies?: string[];
  status: TaskStatus;
}

export const AGENT_ROLES = {
  plannerAgent: "plannerAgent",
  retrieverAgent: "retrieverAgent",
  writerAgent: "writerAgent",
  reflectionAgent: "reflectionAgent",
  predictionAgent: "predictionAgent",
  verificationAgent: "verificationAgent"
} as const;

