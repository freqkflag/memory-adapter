export class TaskExecutor {
    runTask;
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
