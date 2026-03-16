"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyInsight = verifyInsight;
function verifyInsight(text, episodes) {
    const evidenceEpisodes = [];
    let contradictionCount = 0;
    for (const ep of episodes) {
        if (ep.text.toLowerCase().includes("not")) {
            contradictionCount += 1;
        }
        else {
            evidenceEpisodes.push(ep.id);
        }
    }
    const baseConfidence = evidenceEpisodes.length / (evidenceEpisodes.length + contradictionCount || 1);
    const confidence = Math.max(0.1, Math.min(0.99, baseConfidence));
    return {
        text,
        confidence,
        evidenceEpisodes,
        contradictionCount
    };
}
