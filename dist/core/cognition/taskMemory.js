export class TaskMemory {
    tasks = new Map();
    taskToMemories = new Map();
    memoryToTasks = new Map();
    registerTask(task) {
        this.tasks.set(task.id, task);
    }
    linkTaskToMemory(taskId, memoryId) {
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
    getTask(taskId) {
        return this.tasks.get(taskId);
    }
    getTasksForMemory(memoryId) {
        return Array.from(this.memoryToTasks.get(memoryId) ?? []);
    }
    getMemoriesForTask(taskId) {
        return Array.from(this.taskToMemories.get(taskId) ?? []);
    }
}
