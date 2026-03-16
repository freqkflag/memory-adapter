import { MemoryService } from "../memory/MemoryService";
import { AgentRegistry } from "./agentRegistry";
import { OperationLog, Operation } from "./operationLog";
import { ChangeBroadcast } from "./changeBroadcast";
import { MemoryGraph } from "../graph/memoryGraph";
import { hybridRetrieve } from "../search/hybridSearch";

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
}

