import { MemoryItem } from "../memory/MemoryItem";

export interface PredictionPattern {
  description: string;
  supportingIds: string[];
}

export function minePatterns(memories: MemoryItem[]): PredictionPattern[] {
  const byDomain = new Map<string, string[]>();
  for (const m of memories) {
    const list = byDomain.get(m.domain) ?? [];
    list.push(m.id);
    byDomain.set(m.domain, list);
  }

  const patterns: PredictionPattern[] = [];
  for (const [domain, ids] of byDomain.entries()) {
    if (ids.length < 2) continue;
    patterns.push({
      description: `Future activity is likely in domain "${domain}".`,
      supportingIds: ids
    });
  }
  return patterns;
}

