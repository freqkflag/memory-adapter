"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankAndFilter = rankAndFilter;
const time_1 = require("../utils/time");
function rankAndFilter(vectorResults, keywordResults, graphRelevance, profile, limit) {
    const keywordMap = new Map();
    for (const kr of keywordResults) {
        keywordMap.set(kr.item.id, kr.overlap);
    }
    const vectorMap = new Map();
    for (const vr of vectorResults) {
        vectorMap.set(vr.item.id, vr.score);
    }
    const combinedIds = new Set([
        ...Array.from(vectorMap.keys()),
        ...Array.from(keywordMap.keys())
    ]);
    const results = [];
    const seenTexts = new Set();
    const nowTs = (0, time_1.now)();
    for (const id of combinedIds) {
        const semantic_similarity = (vectorMap.get(id) ?? 0) * profile.vectorWeight;
        const keyword_overlap = (keywordMap.get(id) ?? 0) * profile.keywordWeight;
        const graph_relevance = (graphRelevance.get(id) ?? 0) * profile.graphWeight;
        const item = vectorResults.find((v) => v.item.id === id)?.item ??
            keywordResults.find((k) => k.item.id === id)?.item;
        if (!item)
            continue;
        const ageHours = (nowTs - item.timestamp) / (1000 * 60 * 60);
        const temporal_relevance = Math.exp(-ageHours / 72) * profile.temporalWeight;
        const durability_weight = profile.durabilityWeight;
        const strength = item.strength * profile.strengthWeight;
        const normalizedText = item.text.trim().toLowerCase();
        const isRedundant = seenTexts.has(normalizedText);
        const redundancy_penalty = isRedundant ? profile.redundancyPenalty : 0;
        const score = semantic_similarity +
            keyword_overlap +
            graph_relevance +
            temporal_relevance +
            durability_weight +
            strength -
            redundancy_penalty;
        if (!isRedundant) {
            seenTexts.add(normalizedText);
        }
        results.push({ item, score });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
}
