export class WriterAgent {
    memory;
    db;
    coordinator;
    id = "writer";
    name = "Writer Agent";
    type = "writerAgent";
    constructor(memory, db, coordinator) {
        this.memory = memory;
        this.db = db;
        this.coordinator = coordinator;
    }
    async write(domain, text) {
        const item = await this.memory.appendToDomain(domain, text, this.id);
        this.db.add(item);
        await this.coordinator.logOperation({
            agentId: this.id,
            action: "write_memory",
            targetMemoryId: item.id,
            payload: { domain, text }
        });
        return item;
    }
}
