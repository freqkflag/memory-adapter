import { Task, TaskStatus } from "./agentRoles";

export class TaskExecutor {
  updateStatus(task: Task, status: TaskStatus): void {
    task.status = status;
  }

  listPending(task: Task): Task[] {
    const result: Task[] = [];
    const stack: Task[] = [task];
    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) continue;
      if (current.status === "pending") result.push(current);
      for (const sub of current.subtasks) stack.push(sub);
    }
    return result;
  }
}

