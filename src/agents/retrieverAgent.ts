import { MemoryService } from "../memory/MemoryService";
import { rankAndFilter, RetrievalContext } from "../ranking/rankAndFilter";
import { DEFAULT_RETRIEVAL_PROFILE } from "../ranking/retrievalProfiles";
import { MemoryGraph } from "../graph/memoryGraph";
import { MemoryItem } from "../memory/MemoryItem";

export class RetrieverAgent {
  readonly id = "retrieverAgent";
  readonly name = "Retriever Agent";
  readonly type = "retrieverAgent";

  constructor(
    private readonly memory: MemoryService,
    private readonly graph: MemoryGraph
  ) {}

  async retrieve(query: string): Promise<MemoryItem[]> {
    const items = this.memory.getAll();
    const context: RetrievalContext = {
      graph: this.graph,
      profile: DEFAULT_RETRIEVAL_PROFILE
    };
    const ranked = rankAndFilter(query, items, context);
    return ranked.map((r) => r.item);
  }
}

