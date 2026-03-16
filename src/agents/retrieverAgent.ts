import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { AgentRole } from "../planning/agentRoles.js";

export class RetrieverAgent {
  readonly id = "retriever";
  readonly name = "Retriever Agent";
  readonly type: AgentRole = "retrieverAgent";

  constructor(private coordinator: CognitionCoordinator) {}

  async retrieve(query: string) {
    const results = await this.coordinator.retrieveContext(query);
    await this.coordinator.logOperation({
      agentId: this.id,
      action: "retrieve",
      payload: { query, resultCount: results.length }
    });
    return results;
  }
}

