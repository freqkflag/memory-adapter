"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hybridRetrieve = hybridRetrieve;
const vectorSearch_1 = require("./vectorSearch");
const keywordSearch_1 = require("./keywordSearch");
const graphTraversal_1 = require("../graph/graphTraversal");
const retrievalProfiles_1 = require("../ranking/retrievalProfiles");
const rankAndFilter_1 = require("../ranking/rankAndFilter");
function hybridRetrieve(query, items, graph, config = {
    topKVector: 32,
    topKKeyword: 32,
    graphDepth: 2,
    limit: 20
}) {
    const vectorResults = (0, vectorSearch_1.vectorSearch)(query, items, config.topKVector);
    const keywordResults = (0, keywordSearch_1.keywordSearch)(query, items, config.topKKeyword);
    const seedIds = new Set();
    for (const r of vectorResults)
        seedIds.add(r.item.id);
    for (const r of keywordResults)
        seedIds.add(r.item.id);
    const traversal = (0, graphTraversal_1.traverseGraph)(graph, Array.from(seedIds), config.graphDepth);
    const graphRelevance = new Map();
    for (const t of traversal) {
        const existing = graphRelevance.get(t.nodeId) ?? 0;
        graphRelevance.set(t.nodeId, existing + 1 / (t.depth + 1));
    }
    return (0, rankAndFilter_1.rankAndFilter)(vectorResults, keywordResults, graphRelevance, retrievalProfiles_1.DEFAULT_PROFILE, config.limit);
}
