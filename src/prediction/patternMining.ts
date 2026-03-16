import { MemoryItem } from "../memory/MemoryItem.js";

export function minePredictivePatterns(memories: MemoryItem[]): string[] {
  const patterns: string[] = [];
  const byDomain = new Map<string, number>();
  for (const m of memories) {
    byDomain.set(m.domain, (byDomain.get(m.domain) ?? 0) + 1);
  }
  for (const [domain, count] of byDomain.entries()) {
    if (count >= 2) {
      patterns.push(`Future activity likely in domain "${domain}".`);
    }
  }
  return patterns;
}

