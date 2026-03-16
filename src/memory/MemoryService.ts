import { promises as fs } from "fs";
import { MemoryItem } from "./MemoryItem";
import { DOMAIN_FILE_MAP, MemoryDomain } from "./domains";
import { parseMemoryMarkdown } from "../markdown/parseMemory";
import { appendMemoryItemsToMarkdown } from "../markdown/writeMemory";
import { generateId } from "../utils/ids";
import { now } from "../utils/time";

export class MemoryService {
  private memoryIndex: Map<string, MemoryItem> = new Map();

  async loadAll(createdBy: string): Promise<void> {
    for (const [domain, path] of Object.entries(DOMAIN_FILE_MAP) as [MemoryDomain, string][]) {
      const content = await this.safeRead(path);
      const parsed = parseMemoryMarkdown(content, domain, createdBy);
      for (const item of parsed.items) {
        this.memoryIndex.set(item.id, item);
      }
    }
  }

  getAll(): MemoryItem[] {
    return Array.from(this.memoryIndex.values());
  }

  getById(id: string): MemoryItem | undefined {
    return this.memoryIndex.get(id);
  }

  async appendToDomain(domain: MemoryDomain, text: string, agentId: string): Promise<MemoryItem> {
    const path = DOMAIN_FILE_MAP[domain];
    const existing = await this.safeRead(path);
    const item: MemoryItem = {
      id: generateId("mem"),
      text,
      domain,
      durability: "normal",
      sectionPath: [],
      tags: [],
      strength: 0.5,
      importance: 0.5,
      accessCount: 0,
      createdBy: agentId,
      updatedBy: agentId,
      version: 1,
      timestamp: now()
    };
    const updated = appendMemoryItemsToMarkdown(existing, [item], domain);
    await fs.writeFile(path, updated, "utf8");
    this.memoryIndex.set(item.id, item);
    return item;
  }

  updateMemory(item: MemoryItem): void {
    this.memoryIndex.set(item.id, item);
  }

  private async safeRead(path: string): Promise<string> {
    try {
      return await fs.readFile(path, "utf8");
    } catch (err: any) {
      if (err && err.code === "ENOENT") {
        return "";
      }
      throw err;
    }
  }
}

