import { Task } from "./taskPlanner.js";

export class TaskExecutor {
  constructor(private runTask: (task: Task) => Promise<void>) {}

  async execute(task: Task): Promise<void> {
    if (task.subtasks.length === 0) {
      await this.runTask(task);
      task.status = "done";
      return;
    }

    for (const sub of task.subtasks) {
      await this.execute(sub);
    }
    task.status = "done";
  }
}

