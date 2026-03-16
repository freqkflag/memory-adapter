import { normalizeText, tokenize } from "../utils/text";
function embed(text) {
    const tokens = tokenize(text);
    const vec = [];
    for (const token of tokens) {
        let hash = 0;
        for (let i = 0; i < token.length; i++) {
            hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
        }
        vec.push(hash % 997);
    }
    return vec;
}
function cosineSimilarity(a, b) {
    if (a.length === 0 || b.length === 0)
        return 0;
    const len = Math.min(a.length, b.length);
    let dot = 0;
    let na = 0;
    let nb = 0;
    for (let i = 0; i < len; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    if (na === 0 || nb === 0)
        return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
export function vectorSearch(query, items, topK) {
    const qVec = embed(normalizeText(query));
    const results = [];
    for (const item of items) {
        const score = cosineSimilarity(qVec, embed(normalizeText(item.text)));
        results.push({ item, score });
    }
    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}
