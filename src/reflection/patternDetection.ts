import { MemoryItem } from "../memory/MemoryItem";

export function groupEpisodesByDomain(episodes: MemoryItem[]): Map<string, MemoryItem[]> {
  const map = new Map<string, MemoryItem[]>();
  for (const ep of episodes) {
    const list = map.get(ep.domain) ?? [];
    list.push(ep);
    map.set(ep.domain, list);
  }
  return map;
}

export function detectSimplePatterns(episodes: MemoryItem[]): string[] {
  const patterns: string[] = [];
  const byDomain = groupEpisodesByDomain(episodes);
  for (const [domain, eps] of byDomain.entries()) {
    if (eps.length > 3) {
      patterns.push(`Frequent activity in domain "${domain}".`);
    }
  }
  return patterns;
}

