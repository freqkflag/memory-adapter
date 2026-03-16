import { MemoryService } from "../memory/MemoryService.js";
import { AgentRegistry } from "./agentRegistry.js";
import { OperationLog, Operation } from "./operationLog.js";
import { ChangeBroadcast } from "./changeBroadcast.js";
import { MemoryGraph } from "../graph/memoryGraph.js";
import { hybridRetrieve } from "../search/hybridSearch.js";

export class CognitionCoordinator {
  constructor(
    private readonly memory: MemoryService,
    private readonly agents: AgentRegistry,
    private readonly opLog: OperationLog,
    private readonly broadcaster: ChangeBroadcast
  ) {}

  async logOperation(op: Omit<Operation, "id" | "timestamp">): Promise<Operation> {
    const recorded = await this.opLog.record(op);
    this.broadcaster.broadcast(recorded);
    return recorded;
  }

  async retrieveContext(query: string) {
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

  getOperationLog(): OperationLog {
    return this.opLog;
  }

  getMemoryService(): MemoryService {
    return this.memory;
  }
}

