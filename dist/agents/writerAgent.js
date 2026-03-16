"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriterAgent = void 0;
class WriterAgent {
    constructor(memory, coordinator) {
        this.memory = memory;
        this.coordinator = coordinator;
        this.id = "writer";
        this.name = "Writer Agent";
        this.type = "writerAgent";
    }
    async write(domain, text) {
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
exports.WriterAgent = WriterAgent;
