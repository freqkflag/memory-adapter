export function groupEpisodesByDomain(episodes) {
    const map = new Map();
    for (const ep of episodes) {
        const list = map.get(ep.domain) ?? [];
        list.push(ep);
        map.set(ep.domain, list);
    }
    return map;
}
export function detectSimplePatterns(episodes) {
    const patterns = [];
    const byDomain = groupEpisodesByDomain(episodes);
    for (const [domain, eps] of byDomain.entries()) {
        if (eps.length > 3) {
            patterns.push(`Frequent activity in domain "${domain}".`);
        }
    }
    return patterns;
}
