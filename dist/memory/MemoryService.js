"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = void 0;
const fs_1 = require("fs");
const domains_1 = require("./domains");
const parseMemory_1 = require("../markdown/parseMemory");
const writeMemory_1 = require("../markdown/writeMemory");
const ids_1 = require("../utils/ids");
const time_1 = require("../utils/time");
class MemoryService {
    constructor() {
        this.memoryIndex = new Map();
    }
    async loadAll(createdBy) {
        for (const [domain, path] of Object.entries(domains_1.DOMAIN_FILE_MAP)) {
            const content = await this.safeRead(path);
            const parsed = (0, parseMemory_1.parseMemoryMarkdown)(content, domain, createdBy);
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
        const path = domains_1.DOMAIN_FILE_MAP[domain];
        const existing = await this.safeRead(path);
        const item = {
            id: (0, ids_1.generateId)("mem"),
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
            timestamp: (0, time_1.now)()
        };
        const updated = (0, writeMemory_1.appendMemoryItemsToMarkdown)(existing, [item], domain);
        await fs_1.promises.writeFile(path, updated, "utf8");
        this.memoryIndex.set(item.id, item);
        return item;
    }
    updateMemory(item) {
        this.memoryIndex.set(item.id, item);
    }
    async safeRead(path) {
        try {
            return await fs_1.promises.readFile(path, "utf8");
        }
        catch (err) {
            if (err && err.code === "ENOENT") {
                return "";
            }
            throw err;
        }
    }
}
exports.MemoryService = MemoryService;
