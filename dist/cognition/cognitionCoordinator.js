export class CognitionCoordinator {
    memory;
    db;
    agents;
    opLog;
    broadcaster;
    constructor(memory, db, agents, opLog, broadcaster) {
        this.memory = memory;
        this.db = db;
        this.agents = agents;
        this.opLog = opLog;
        this.broadcaster = broadcaster;
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
}
