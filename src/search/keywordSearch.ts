import { MemoryItem } from "../memory/MemoryItem";
import { keywordOverlap } from "../utils/text";

export interface KeywordSearchResult {
  item: MemoryItem;
  overlap: number;
}

export function keywordSearch(
  query: string,
  items: MemoryItem[]
): KeywordSearchResult[] {
  return items
    .map((item) => ({
      item,
      overlap: keywordOverlap(query, item.text)
    }))
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);
}

