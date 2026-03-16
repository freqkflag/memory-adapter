import { MemoryItem } from "../memory/MemoryItem.js";
import { vectorSearch } from "./vectorSearch.js";
import { keywordSearch } from "./keywordSearch.js";
import { MemoryGraph } from "../graph/memoryGraph.js";
import { traverseGraph } from "../graph/graphTraversal.js";
import { DEFAULT_PROFILE } from "../ranking/retrievalProfiles.js";
import { rankAndFilter, RankedResult } from "../ranking/rankAndFilter.js";

export interface HybridRetrievalConfig {
  topKVector: number;
  topKKeyword: number;
  graphDepth: number;
  limit: number;
}

export function hybridRetrieve(
  query: string,
  items: MemoryItem[],
  graph: MemoryGraph,
  config: HybridRetrievalConfig = {
    topKVector: 32,
    topKKeyword: 32,
    graphDepth: 2,
    limit: 20
  }
): RankedResult[] {
  const vectorResults = vectorSearch(query, items, config.topKVector);
  const keywordResults = keywordSearch(query, items, config.topKKeyword);

  const seedIds = new Set<string>();
  for (const r of vectorResults) seedIds.add(r.item.id);
  for (const r of keywordResults) seedIds.add(r.item.id);

  const traversal = traverseGraph(graph, Array.from(seedIds), config.graphDepth);
  const graphRelevance = new Map<string, number>();
  for (const t of traversal) {
    const existing = graphRelevance.get(t.nodeId) ?? 0;
    graphRelevance.set(t.nodeId, existing + 1 / (t.depth + 1));
  }

  return rankAndFilter(vectorResults, keywordResults, graphRelevance, DEFAULT_PROFILE, config.limit);
}

