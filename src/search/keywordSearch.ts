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

import { MemoryItem } from "../types";

export interface InvertedIndex {
  termToItems: Map<string, Set<string>>;
  tagToItems: Map<string, Set<string>>;
  sectionToItems: Map<string, Set<string>>;
}

export function buildInvertedIndex(items: MemoryItem[]): InvertedIndex {
  const termToItems = new Map<string, Set<string>>();
  const tagToItems = new Map<string, Set<string>>();
  const sectionToItems = new Map<string, Set<string>>();

  const add = (map: Map<string, Set<string>>, key: string, id: string) => {
    const normalized = key.toLowerCase();
    if (!normalized) return;
    if (!map.has(normalized)) map.set(normalized, new Set());
    map.get(normalized)!.add(id);
  };

  for (const item of items) {
    const id = item.id;
    const text = item.text.toLowerCase();
    const words = text.split(/[^a-z0-9]+/).filter(Boolean);
    for (const w of words) add(termToItems, w, id);

    for (const tag of item.tags) add(tagToItems, tag, id);

    const sectionKey = item.sectionPath.join(" > ");
    if (sectionKey) add(sectionToItems, sectionKey, id);
  }

  return { termToItems, tagToItems, sectionToItems };
}

export function keywordSearch(
  query: string,
  items: MemoryItem[],
  index: InvertedIndex,
  limit: number
): { item: MemoryItem; score: number }[] {
  const q = query.toLowerCase();
  const terms = q.split(/[^a-z0-9]+/).filter(Boolean);

  const scores = new Map<string, number>();

  const bump = (id: string, amount: number) => {
    scores.set(id, (scores.get(id) ?? 0) + amount);
  };

  for (const term of terms) {
    const termMatches = index.termToItems.get(term);
    if (termMatches) {
      for (const id of termMatches) bump(id, 1.5);
    }
  }

  for (const term of terms) {
    const tagMatches = index.tagToItems.get(term);
    if (tagMatches) {
      for (const id of tagMatches) bump(id, 2);
    }
  }

  for (const [section, ids] of index.sectionToItems.entries()) {
    if (section.toLowerCase().includes(q)) {
      for (const id of ids) bump(id, 1);
    }
  }

  const byId = new Map(items.map((i) => [i.id, i]));
  const scored: { item: MemoryItem; score: number }[] = [];
  for (const [id, score] of scores.entries()) {
    const item = byId.get(id);
    if (item) scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

