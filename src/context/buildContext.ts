import { ScoredItem } from "../ranking/rerankResults";
import { MemoryItem } from "../types";

export interface ContextResult {
  items: MemoryItem[];
}

export function buildContext(
  scored: ScoredItem[],
  maxItems: number
): ContextResult {
  if (scored.length <= maxItems) {
    return { items: scored.map((s) => s.item) };
  }

  const selected: ScoredItem[] = [];
  const topicBuckets = new Map<string, ScoredItem[]>();

  const topicFor = (item: MemoryItem): string => {
    const text = item.text.toLowerCase();
    if (text.includes("tattoo")) return "tattoo";
    if (text.includes("budget")) return "budget";
    if (text.includes("cosplay")) return "cosplay";
    if (text.includes("halloween") || text.includes("horror")) return "halloween";
    if (text.includes("diy")) return "diy";
    if (text.includes("project")) return "projects";
    if (text.includes("energy") || text.includes("support")) return "state";
    return "other";
  };

  for (const s of scored) {
    const t = topicFor(s.item);
    if (!topicBuckets.has(t)) topicBuckets.set(t, []);
    topicBuckets.get(t)!.push(s);
  }

  for (const bucket of topicBuckets.values()) {
    bucket.sort((a, b) => b.score - a.score);
  }

  const usedTopics = new Set<string>();
  for (const [topic, bucket] of topicBuckets.entries()) {
    if (bucket.length === 0) continue;
    selected.push(bucket[0]);
    usedTopics.add(topic);
    if (selected.length >= maxItems) {
      return { items: selected.map((s) => s.item) };
    }
  }

  const remaining: ScoredItem[] = [];
  for (const bucket of topicBuckets.values()) {
    remaining.push(...bucket.slice(1));
  }
  remaining.sort((a, b) => b.score - a.score);

  for (const r of remaining) {
    if (selected.length >= maxItems) break;
    selected.push(r);
  }

  return { items: selected.map((s) => s.item) };
}

