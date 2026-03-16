"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCounterfactual = generateCounterfactual;
function generateCounterfactual(insight) {
    let text = insight.text;
    if (text.includes(" prefers ")) {
        text = text.replace(" prefers ", " prefers not ");
    }
    else if (text.includes("often")) {
        text = text.replace("often", "rarely");
    }
    else {
        text = `Opposite of: ${text}`;
    }
    return {
        text,
        confidence: Math.max(0.1, 1 - insight.confidence),
        evidenceEpisodes: [],
        contradictionCount: 0
    };
}
