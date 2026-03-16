import { MemoryItem } from "../memory/MemoryItem.js";
import { VectorSearchResult } from "../search/vectorSearch.js";
import { KeywordSearchResult } from "../search/keywordSearch.js";
import { RetrievalProfile } from "./retrievalProfiles.js";
import { now } from "../utils/time.js";

export interface RankedResult {
  item: MemoryItem;
  score: number;
}

export function rankAndFilter(
  vectorResults: VectorSearchResult[],
  keywordResults: KeywordSearchResult[],
  graphRelevance: Map<string, number>,
  profile: RetrievalProfile,
  limit: number
): RankedResult[] {
  const keywordMap = new Map<string, number>();
  for (const kr of keywordResults) {
    keywordMap.set(kr.item.id, kr.overlap);
  }

  const vectorMap = new Map<string, number>();
  for (const vr of vectorResults) {
    vectorMap.set(vr.item.id, vr.score);
  }

  const combinedIds = new Set<string>([
    ...Array.from(vectorMap.keys()),
    ...Array.from(keywordMap.keys())
  ]);

  const results: RankedResult[] = [];
  const seenTexts = new Set<string>();
  const nowTs = now();

  for (const id of combinedIds) {
    const semantic_similarity = (vectorMap.get(id) ?? 0) * profile.vectorWeight;
    const keyword_overlap = (keywordMap.get(id) ?? 0) * profile.keywordWeight;
    const graph_relevance = (graphRelevance.get(id) ?? 0) * profile.graphWeight;

    const item =
      vectorResults.find((v) => v.item.id === id)?.item ??
      keywordResults.find((k) => k.item.id === id)?.item;
    if (!item) continue;

    const ageHours = (nowTs - item.timestamp) / (1000 * 60 * 60);
    const temporal_relevance = Math.exp(-ageHours / 72) * profile.temporalWeight;

    const durability_weight = profile.durabilityWeight;
    const strength = item.strength * profile.strengthWeight;

    const normalizedText = item.text.trim().toLowerCase();
    const isRedundant = seenTexts.has(normalizedText);
    const redundancy_penalty = isRedundant ? profile.redundancyPenalty : 0;

    const score =
      semantic_similarity +
      keyword_overlap +
      graph_relevance +
      temporal_relevance +
      durability_weight +
      strength -
      redundancy_penalty;

    if (!isRedundant) {
      seenTexts.add(normalizedText);
    }

    results.push({ item, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

