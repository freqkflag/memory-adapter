import { MemoryItem } from "../memory/MemoryItem";
import { vectorSearch } from "../search/vectorSearch";
import { keywordSearch } from "../search/keywordSearch";
import { MemoryGraph } from "../graph/memoryGraph";
import { traverseGraph } from "../graph/graphTraversal";
import { RetrievalProfile } from "./retrievalProfiles";
import { now } from "../utils/time";

export interface RankedMemory {
  item: MemoryItem;
  score: number;
}

export interface RetrievalContext {
  graph: MemoryGraph;
  profile: RetrievalProfile;
}

export function rankAndFilter(
  query: string,
  items: MemoryItem[],
  context: RetrievalContext
): RankedMemory[] {
  const vectorResults = vectorSearch(query, items);
  const keywordResults = keywordSearch(query, items);

  const vectorMap = new Map<string, number>();
  for (const r of vectorResults) vectorMap.set(r.item.id, r.similarity);

  const keywordMap = new Map<string, number>();
  for (const r of keywordResults) keywordMap.set(r.item.id, r.overlap);

  const graphRelevantIds = traverseGraph(
    context.graph,
    items.map((m) => m.id),
    context.profile.graphDepth
  );
  const graphSet = new Set(graphRelevantIds);

  const nowTs = now();

  const combined: RankedMemory[] = items.map((item) => {
    const semanticSimilarity = vectorMap.get(item.id) ?? 0;
    const keywordOverlap = keywordMap.get(item.id) ?? 0;
    const graphRelevance = graphSet.has(item.id) ? 0.3 : 0;
    const ageHours = (nowTs - item.timestamp) / (1000 * 60 * 60);
    const temporalRelevance = 1 / (1 + ageHours / 24);
    const durabilityWeight =
      item.durability === "core"
        ? 0.6
        : item.durability === "long-term"
        ? 0.4
        : item.durability === "medium-term"
        ? 0.2
        : 0.1;
    const redundancyPenalty = item.accessCount > 0 ? 0.1 * item.accessCount : 0;

    const score =
      semanticSimilarity +
      keywordOverlap +
      graphRelevance +
      temporalRelevance +
      durabilityWeight +
      item.strength +
      -redundancyPenalty;

    return { item, score };
  });

  combined.sort((a, b) => b.score - a.score);

  const uniqueByText = new Map<string, RankedMemory>();
  for (const r of combined) {
    const key = r.item.text.slice(0, 64);
    const existing = uniqueByText.get(key);
    if (!existing || existing.score < r.score) {
      uniqueByText.set(key, r);
    }
  }

  return Array.from(uniqueByText.values()).slice(0, context.profile.maxResults);
}

