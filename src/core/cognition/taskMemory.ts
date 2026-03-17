export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface TaskRecord {
  id: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
  domain?: string;
}

export class TaskMemory {
  private tasks = new Map<string, TaskRecord>();
  private taskToMemories = new Map<string, Set<string>>();
  private memoryToTasks = new Map<string, Set<string>>();

  registerTask(task: TaskRecord): void {
    this.tasks.set(task.id, task);
  }

  linkTaskToMemory(taskId: string, memoryId: string): void {
    if (!this.tasks.has(taskId)) {
      return;
    }
    let mems = this.taskToMemories.get(taskId);
    if (!mems) {
      mems = new Set();
      this.taskToMemories.set(taskId, mems);
    }
    mems.add(memoryId);

    let tasks = this.memoryToTasks.get(memoryId);
    if (!tasks) {
      tasks = new Set();
      this.memoryToTasks.set(memoryId, tasks);
    }
    tasks.add(taskId);
  }

  getTask(taskId: string): TaskRecord | undefined {
    return this.tasks.get(taskId);
  }

  getTasksForMemory(memoryId: string): string[] {
    return Array.from(this.memoryToTasks.get(memoryId) ?? []);
  }

  getMemoriesForTask(taskId: string): string[] {
    return Array.from(this.taskToMemories.get(taskId) ?? []);
  }
}

