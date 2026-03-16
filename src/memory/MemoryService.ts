import { MemoryItem } from "./MemoryItem";
import { DOMAIN_FILE_MAP, MemoryDomain } from "./domains";
import { parseMemoryFile } from "../markdown/parseMemory";
import { appendMemoryToFile } from "../markdown/writeMemory";
import { generateId } from "../utils/ids";
import { now } from "../utils/time";

export class MemoryService {
  private cache: Map<string, MemoryItem> = new Map();

  async loadDomain(domain: MemoryDomain, agentId: string): Promise<MemoryItem[]> {
    const file = DOMAIN_FILE_MAP[domain];
    const items = await parseMemoryFile(file, domain, agentId);
    for (const item of items) {
      this.cache.set(item.id, item);
    }
    return items;
  }

  getAll(): MemoryItem[] {
    return Array.from(this.cache.values());
  }

  getById(id: string): MemoryItem | undefined {
    return this.cache.get(id);
  }

  async addMemory(
    domain: MemoryDomain,
    text: string,
    sectionPath: string[],
    tags: string[],
    createdBy: string,
    durability: string = "medium-term"
  ): Promise<MemoryItem> {
    const item: MemoryItem = {
      id: generateId("mem"),
      text,
      domain,
      durability,
      sectionPath,
      tags,
      strength: 0.5,
      importance: 0.5,
      accessCount: 0,
      createdBy,
      updatedBy: createdBy,
      version: 1,
      timestamp: now()
    };
    const file = DOMAIN_FILE_MAP[domain];
    await appendMemoryToFile(file, item);
    this.cache.set(item.id, item);
    return item;
  }
}

