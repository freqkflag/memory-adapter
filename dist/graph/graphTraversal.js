"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseGraph = traverseGraph;
function traverseGraph(graph, startIds, maxDepth) {
    const results = [];
    const queue = [];
    const visited = new Set();
    for (const id of startIds) {
        queue.push({ id, depth: 0 });
        visited.add(id);
    }
    while (queue.length > 0) {
        const { id, depth } = queue.shift();
        results.push({ nodeId: id, depth });
        if (depth >= maxDepth)
            continue;
        for (const edge of graph.getNeighbors(id)) {
            if (!visited.has(edge.to)) {
                visited.add(edge.to);
                queue.push({ id: edge.to, depth: depth + 1 });
            }
        }
    }
    return results;
}
