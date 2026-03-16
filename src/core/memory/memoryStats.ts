import type { MemoryItem } from "../../memory/MemoryItem.js";

export interface TierStats {
  count: number;
  averageAgeMs: number;
}

export interface DomainStats {
  count: number;
  averageAgeMs: number;
}

export interface MemoryStats {
  totalCount: number;
  averageAgeMs: number;
  byTier: Record<string, TierStats>;
  byDomain: Record<string, DomainStats>;
}

export function computeMemoryStats(memories: MemoryItem[], now: number = Date.now()): MemoryStats {
  const totalCount = memories.length;

  let ageSum = 0;
  const byTierAges = new Map<string, { count: number; ageSum: number }>();
  const byDomainAges = new Map<string, { count: number; ageSum: number }>();

  for (const m of memories) {
    const age = Math.max(0, now - m.timestamp);
    ageSum += age;

    const tierKey = m.durability || "unknown";
    const tierBucket = byTierAges.get(tierKey) ?? { count: 0, ageSum: 0 };
    tierBucket.count += 1;
    tierBucket.ageSum += age;
    byTierAges.set(tierKey, tierBucket);

    const domainKey = m.domain || "unknown";
    const domainBucket = byDomainAges.get(domainKey) ?? { count: 0, ageSum: 0 };
    domainBucket.count += 1;
    domainBucket.ageSum += age;
    byDomainAges.set(domainKey, domainBucket);
  }

  const averageAgeMs = totalCount ? ageSum / totalCount : 0;

  const byTier: Record<string, TierStats> = {};
  for (const [tier, bucket] of byTierAges.entries()) {
    byTier[tier] = {
      count: bucket.count,
      averageAgeMs: bucket.count ? bucket.ageSum / bucket.count : 0
    };
  }

  const byDomain: Record<string, DomainStats> = {};
  for (const [domain, bucket] of byDomainAges.entries()) {
    byDomain[domain] = {
      count: bucket.count,
      averageAgeMs: bucket.count ? bucket.ageSum / bucket.count : 0
    };
  }

  return {
    totalCount,
    averageAgeMs,
    byTier,
    byDomain
  };
}

