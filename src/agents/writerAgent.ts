import { MemoryService } from "../memory/MemoryService";
import { MemoryDomain } from "../memory/domains";

export class WriterAgent {
  readonly id = "writerAgent";
  readonly name = "Writer Agent";
  readonly type = "writerAgent";

  constructor(private readonly memory: MemoryService) {}

  async write(
    domain: MemoryDomain,
    text: string,
    sectionPath: string[],
    tags: string[],
    createdBy: string
  ) {
    return this.memory.addMemory(domain, text, sectionPath, tags, createdBy);
  }
}

