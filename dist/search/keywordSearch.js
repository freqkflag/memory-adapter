import { keywordOverlap, tokenize } from "../utils/text";
export function keywordSearch(query, items, topK) {
    const qTokens = tokenize(query);
    const results = [];
    for (const item of items) {
        const overlap = keywordOverlap(qTokens, tokenize(item.text));
        if (overlap > 0) {
            results.push({ item, overlap });
        }
    }
    return results
        .sort((a, b) => b.overlap - a.overlap)
        .slice(0, topK);
}
