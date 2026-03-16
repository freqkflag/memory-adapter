import { MemoryService } from "../memory/MemoryService.js";
import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { AgentRole } from "../planning/agentRoles.js";
import { MemoryDomain } from "../memory/domains.js";

export class WriterAgent {
  readonly id = "writer";
  readonly name = "Writer Agent";
  readonly type: AgentRole = "writerAgent";

  constructor(private memory: MemoryService, private coordinator: CognitionCoordinator) {}

  async write(domain: MemoryDomain, text: string) {
    const item = await this.memory.appendToDomain(domain, text, this.id);
    await this.coordinator.logOperation({
      agentId: this.id,
      action: "write_memory",
      targetMemoryId: item.id,
      payload: { domain, text }
    });
    return item;
  }
}

