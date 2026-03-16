import { MemoryService } from "../memory/MemoryService";
import { MemoryDomain } from "../memory/domains";
import { CognitionCoordinator } from "../cognition/cognitionCoordinator";

export class WriterAgent {
  readonly id = "writerAgent";
  readonly name = "Writer Agent";
  readonly type = "writerAgent";

  constructor(
    private readonly memory: MemoryService,
    private readonly coordinator?: CognitionCoordinator
  ) {}

  async write(
    domain: MemoryDomain,
    text: string,
    sectionPath: string[],
    tags: string[],
    createdBy: string
  ) {
    const item = await this.memory.addMemory(
      domain,
      text,
      sectionPath,
      tags,
      createdBy
    );

    if (this.coordinator) {
      await this.coordinator.recordOperation({
        agentId: this.id,
        action: "write_memory",
        targetMemoryId: item.id,
        payload: {
          domain,
          sectionPath,
          tags
        }
      });
    }

    return item;
  }
}

