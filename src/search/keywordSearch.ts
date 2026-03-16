import { MemoryItem } from "../memory/MemoryItem.js";
import { keywordOverlap, tokenize } from "../utils/text.js";

export interface KeywordSearchResult {
  item: MemoryItem;
  overlap: number;
}

export function keywordSearch(query: string, items: MemoryItem[], topK: number): KeywordSearchResult[] {
  const qTokens = tokenize(query);
  const results: KeywordSearchResult[] = [];
  for (const item of items) {
    const overlap = keywordOverlap(qTokens, tokenize(item.text));
    if (overlap > 0) {
      results.push({ item, overlap });
    }
  }
  return results
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, topK);
}

