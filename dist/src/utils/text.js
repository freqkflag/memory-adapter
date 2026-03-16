export function normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, " ").trim();
}
export function tokenize(text) {
    return normalizeText(text)
        .split(" ")
        .filter(Boolean);
}
export function keywordOverlap(queryTokens, docTokens) {
    const docSet = new Set(docTokens);
    let overlap = 0;
    for (const token of queryTokens) {
        if (docSet.has(token))
            overlap += 1;
    }
    return overlap;
}
