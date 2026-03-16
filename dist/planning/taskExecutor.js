"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskExecutor = void 0;
class TaskExecutor {
    constructor(runTask) {
        this.runTask = runTask;
    }
    async execute(task) {
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
exports.TaskExecutor = TaskExecutor;
