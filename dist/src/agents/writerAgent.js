export class WriterAgent {
    memory;
    coordinator;
    id = "writer";
    name = "Writer Agent";
    type = "writerAgent";
    constructor(memory, coordinator) {
        this.memory = memory;
        this.coordinator = coordinator;
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
