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

import { MemoryItem } from "../types";
import { OperationLog, Operation } from "./operationLog";
import { resolveConflict } from "./conflictResolver";

export interface WriteOperation {
  agentId: string;
  action: string;
  targetMemoryId?: string;
  payload: any;
}

export class CognitionCoordinator {
  private items: Map<string, MemoryItem>;
  private opLog: OperationLog;

  constructor(baseDir: string) {
    this.items = new Map();
    this.opLog = new OperationLog(baseDir);
  }

  seed(items: MemoryItem[]): void {
    this.items.clear();
    for (const item of items) {
      const version = item.version ?? 0;
      this.items.set(item.id, { ...item, version });
    }
  }

  getSnapshot(): MemoryItem[] {
    return Array.from(this.items.values());
  }

  applyOperation(op: WriteOperation): MemoryItem | null {
    const id = `op-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const logEntry: Operation = {
      id,
      agentId: op.agentId,
      action: op.action,
      targetMemoryId: op.targetMemoryId,
      payload: op.payload,
      timestamp: Date.now(),
    };
    this.opLog.append(logEntry);

    if (!op.targetMemoryId) {
      return null;
    }

    const existing = this.items.get(op.targetMemoryId);
    if (!existing) {
      const created: MemoryItem = {
        ...op.payload,
        id: op.targetMemoryId,
        version: 1,
        createdBy: op.agentId,
        updatedBy: op.agentId,
        lastOperationId: id,
      };
      this.items.set(created.id, created);
      return created;
    }

    const incoming: MemoryItem = {
      ...existing,
      ...op.payload,
      version: (existing.version ?? 0) + 1,
      updatedBy: op.agentId,
      lastOperationId: id,
    };

    const { item: resolved } = resolveConflict(existing, incoming);
    this.items.set(resolved.id, resolved);
    return resolved;
  }
}

