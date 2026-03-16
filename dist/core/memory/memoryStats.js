export function computeMemoryStats(memories, now = Date.now()) {
    const totalCount = memories.length;
    let ageSum = 0;
    const byTierAges = new Map();
    const byDomainAges = new Map();
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
    const byTier = {};
    for (const [tier, bucket] of byTierAges.entries()) {
        byTier[tier] = {
            count: bucket.count,
            averageAgeMs: bucket.count ? bucket.ageSum / bucket.count : 0
        };
    }
    const byDomain = {};
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
