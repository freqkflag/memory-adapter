"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeText = normalizeText;
exports.tokenize = tokenize;
exports.keywordOverlap = keywordOverlap;
function normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, " ").trim();
}
function tokenize(text) {
    return normalizeText(text)
        .split(" ")
        .filter(Boolean);
}
function keywordOverlap(queryTokens, docTokens) {
    const docSet = new Set(docTokens);
    let overlap = 0;
    for (const token of queryTokens) {
        if (docSet.has(token))
            overlap += 1;
    }
    return overlap;
}
