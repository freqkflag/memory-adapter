import { promises as fs } from "fs";
import { DOMAIN_FILE_MAP } from "./domains";
import { parseMemoryMarkdown } from "../markdown/parseMemory";
import { appendMemoryItemsToMarkdown } from "../markdown/writeMemory";
import { generateId } from "../utils/ids";
import { now } from "../utils/time";
export class MemoryService {
    memoryIndex = new Map();
    async loadAll(createdBy) {
        for (const [domain, path] of Object.entries(DOMAIN_FILE_MAP)) {
            const content = await this.safeRead(path);
            const parsed = parseMemoryMarkdown(content, domain, createdBy);
            for (const item of parsed.items) {
                this.memoryIndex.set(item.id, item);
            }
        }
    }
    getAll() {
        return Array.from(this.memoryIndex.values());
    }
    getById(id) {
        return this.memoryIndex.get(id);
    }
    async appendToDomain(domain, text, agentId) {
        const path = DOMAIN_FILE_MAP[domain];
        const existing = await this.safeRead(path);
        const item = {
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
    updateMemory(item) {
        this.memoryIndex.set(item.id, item);
    }
    async safeRead(path) {
        try {
            return await fs.readFile(path, "utf8");
        }
        catch (err) {
            if (err && err.code === "ENOENT") {
                return "";
            }
            throw err;
        }
    }
}
