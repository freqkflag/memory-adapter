import { TaskMemory } from "../core/cognition/taskMemory.js";
export class CognitionCoordinator {
    memory;
    db;
    agents;
    opLog;
    broadcaster;
    taskMemory;
    constructor(memory, db, agents, opLog, broadcaster, taskMemory = new TaskMemory()) {
        this.memory = memory;
        this.db = db;
        this.agents = agents;
        this.opLog = opLog;
        this.broadcaster = broadcaster;
        this.taskMemory = taskMemory;
    }
    async logOperation(op) {
        const recorded = await this.opLog.record(op);
        this.broadcaster.broadcast(recorded);
        return recorded;
    }
    async retrieveContext(query) {
        return this.db.search(query);
    }
    listAgents() {
        return this.agents.list();
    }
    getAllMemories() {
        return this.memory.getAll();
    }
    getOperationLog() {
        return this.opLog;
    }
    getMemoryService() {
        return this.memory;
    }
    registerTask(task) {
        this.taskMemory.registerTask(task);
    }
    linkTaskToMemory(taskId, memoryId) {
        this.taskMemory.linkTaskToMemory(taskId, memoryId);
    }
    getTaskMemory() {
        return this.taskMemory;
    }
}
