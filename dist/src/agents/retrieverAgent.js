export class RetrieverAgent {
    coordinator;
    id = "retriever";
    name = "Retriever Agent";
    type = "retrieverAgent";
    constructor(coordinator) {
        this.coordinator = coordinator;
    }
    async retrieve(query) {
        const results = await this.coordinator.retrieveContext(query);
        await this.coordinator.logOperation({
            agentId: this.id,
            action: "retrieve",
            payload: { query, resultCount: results.length }
        });
        return results;
    }
}
