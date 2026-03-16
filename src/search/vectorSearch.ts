import { MemoryItem } from "../memory/MemoryItem.js";
import { normalizeText } from "../utils/text.js";
import { getDefaultEmbeddingProvider } from "../core/retrieval/embeddingProvider.js";

export interface VectorSearchResult {
  item: MemoryItem;
  score: number;
}

const embeddingProvider = getDefaultEmbeddingProvider();

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function vectorSearch(query: string, items: MemoryItem[], topK: number): VectorSearchResult[] {
  const qVec = embeddingProvider.embed(normalizeText(query));
  const results: VectorSearchResult[] = [];
  for (const item of items) {
    const score = cosineSimilarity(qVec, embeddingProvider.embed(normalizeText(item.text)));
    results.push({ item, score });
  }
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

