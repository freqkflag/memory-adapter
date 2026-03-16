"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keywordSearch = keywordSearch;
const text_1 = require("../utils/text");
function keywordSearch(query, items, topK) {
    const qTokens = (0, text_1.tokenize)(query);
    const results = [];
    for (const item of items) {
        const overlap = (0, text_1.keywordOverlap)(qTokens, (0, text_1.tokenize)(item.text));
        if (overlap > 0) {
            results.push({ item, overlap });
        }
    }
    return results
        .sort((a, b) => b.overlap - a.overlap)
        .slice(0, topK);
}
