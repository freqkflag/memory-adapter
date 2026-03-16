import { MemoryItem, IntentAnalysis } from "../types";
import { ExpandedResult } from "../graph/graphTraversal";

export interface ScoredItem {
  item: MemoryItem;
  score: number;
  breakdown: {
    semantic: number;
    keyword: number;
    graph: number;
    recency: number;
    durability: number;
    importance: number;
    strength: number;
    redundancyPenalty: number;
  };
}

export function rerankResults(
  intent: IntentAnalysis,
  vectorResults: { item: MemoryItem; score: number }[],
  keywordResults: { item: MemoryItem; score: number }[],
  expanded: ExpandedResult[]
): ScoredItem[] {
  const byId = new Map<string, MemoryItem>();
  const semanticScores = new Map<string, number>();
  const keywordScores = new Map<string, number>();
  const graphDistance = new Map<string, number>();

  for (const { item, score } of vectorResults) {
    byId.set(item.id, item);
    semanticScores.set(item.id, score);
  }
  for (const { item, score } of keywordResults) {
    byId.set(item.id, item);
    keywordScores.set(item.id, score);
  }
  for (const { item, distance } of expanded) {
    byId.set(item.id, item);
    const existing = graphDistance.get(item.id);
    if (existing === undefined || distance < existing) {
      graphDistance.set(item.id, distance);
    }
  }

  const scored: ScoredItem[] = [];
  const now = Date.now();

  for (const [id, item] of byId.entries()) {
    const semanticRaw = semanticScores.get(id) ?? 0;
    const keywordRaw = keywordScores.get(id) ?? 0;
    const graphDist = graphDistance.get(id);

    const semantic = semanticRaw;
    const keyword = keywordRaw;
    const graph = graphDist === undefined ? 0 : 1.0 / (1 + graphDist);

    let recency = 0;
    if (item.lastUpdated) {
      const t = Date.parse(item.lastUpdated);
      if (!isNaN(t)) {
        const ageDays = (now - t) / (1000 * 60 * 60 * 24);
        recency = 1 / (1 + ageDays);
      }
    }

    let durability = 0;
    if (item.durability === "stable") durability = 0.8;
    else if (item.durability === "semi_stable") durability = 0.5;
    else if (item.durability === "dynamic") durability = 0.6;
    else if (item.durability === "historical") durability = 0.3;

    const importance = intent.importance ?? 0.5;

    const strengthValue = item.strength ?? 0;

    const redundancyPenalty = 0;

    const score =
      semantic * 1.5 +
      keyword * 1.2 +
      graph * 0.8 +
      recency * 0.5 +
      durability * 0.4 +
      importance * 0.3 +
      strengthValue * 1.0 -
      redundancyPenalty;

    scored.push({
      item,
      score,
      breakdown: {
        semantic,
        keyword,
        graph,
        recency,
        durability,
        importance,
        strength: strengthValue,
        redundancyPenalty,
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

