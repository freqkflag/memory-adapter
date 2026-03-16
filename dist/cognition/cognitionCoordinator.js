"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitionCoordinator = void 0;
const memoryGraph_1 = require("../graph/memoryGraph");
const hybridSearch_1 = require("../search/hybridSearch");
class CognitionCoordinator {
    constructor(memory, agents, opLog, broadcaster) {
        this.memory = memory;
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
        const memories = this.memory.getAll();
        const graph = memoryGraph_1.MemoryGraph.buildFromMemories(memories);
        return (0, hybridSearch_1.hybridRetrieve)(query, memories, graph);
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
}
exports.CognitionCoordinator = CognitionCoordinator;
