"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrieverAgent = void 0;
class RetrieverAgent {
    constructor(coordinator) {
        this.coordinator = coordinator;
        this.id = "retriever";
        this.name = "Retriever Agent";
        this.type = "retrieverAgent";
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
exports.RetrieverAgent = RetrieverAgent;
