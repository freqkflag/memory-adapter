import { MemoryService } from "../memory/MemoryService.js";
import { AgentRegistry } from "./agentRegistry.js";
import { OperationLog, Operation } from "./operationLog.js";
import { ChangeBroadcast } from "./changeBroadcast.js";
import type { MemoryDb } from "../core/memory/memoryDb.js";
import { TaskMemory, type TaskRecord } from "../core/cognition/taskMemory.js";

export class CognitionCoordinator {
  constructor(
    private readonly memory: MemoryService,
    private readonly db: MemoryDb,
    private readonly agents: AgentRegistry,
    private readonly opLog: OperationLog,
    private readonly broadcaster: ChangeBroadcast,
    private readonly taskMemory: TaskMemory = new TaskMemory()
  ) {}

  async logOperation(op: Omit<Operation, "id" | "timestamp">): Promise<Operation> {
    const recorded = await this.opLog.record(op);
    this.broadcaster.broadcast(recorded);
    return recorded;
  }

  async retrieveContext(query: string) {
    return this.db.search(query);
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

  registerTask(task: TaskRecord): void {
    this.taskMemory.registerTask(task);
  }

  linkTaskToMemory(taskId: string, memoryId: string): void {
    this.taskMemory.linkTaskToMemory(taskId, memoryId);
  }

  getTaskMemory(): TaskMemory {
    return this.taskMemory;
  }
}

