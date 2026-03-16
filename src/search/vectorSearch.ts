import { MemoryItem } from "../memory/MemoryItem";
import { cosineSimilarity } from "../utils/text";

function embed(text: string): number[] {
  const normalized = text.toLowerCase();
  const features = ["project", "timeline", "current", "idea", "emotion", "reflection"];
  return features.map((f) => (normalized.includes(f) ? 1 : 0));
}

export interface VectorSearchResult {
  item: MemoryItem;
  similarity: number;
}

export function vectorSearch(
  query: string,
  items: MemoryItem[]
): VectorSearchResult[] {
  const queryVec = embed(query);
  return items
    .map((item) => {
      const sim = cosineSimilarity(queryVec, embed(item.text));
      return { item, similarity: sim };
    })
    .filter((r) => r.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity);
}

