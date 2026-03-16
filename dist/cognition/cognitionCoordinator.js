import { MemoryGraph } from "../graph/memoryGraph.js";
import { hybridRetrieve } from "../search/hybridSearch.js";
export class CognitionCoordinator {
    memory;
    agents;
    opLog;
    broadcaster;
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
        const graph = MemoryGraph.buildFromMemories(memories);
        return hybridRetrieve(query, memories, graph);
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
