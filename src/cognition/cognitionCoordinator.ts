import { AgentRegistry, Agent } from "./agentRegistry";
import { ChangeBroadcast } from "./changeBroadcast";
import { createOperation, appendOperation, Operation } from "./operationLog";

export class CognitionCoordinator {
  constructor(
    private readonly registry: AgentRegistry,
    private readonly broadcast: ChangeBroadcast
  ) {}

  registerAgent(agent: Agent): void {
    this.registry.register(agent);
    this.broadcast.broadcast("agent_registered", agent);
  }

  async recordOperation(params: Omit<Operation, "id" | "timestamp">): Promise<Operation> {
    const op = createOperation(params);
    await appendOperation(op);
    this.broadcast.broadcast("operation_recorded", op);
    return op;
  }
}

