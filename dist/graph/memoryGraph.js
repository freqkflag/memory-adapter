"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryGraph = void 0;
class MemoryGraph {
    constructor() {
        this.adjacency = new Map();
    }
    addEdge(edge) {
        if (!this.adjacency.has(edge.from)) {
            this.adjacency.set(edge.from, []);
        }
        this.adjacency.get(edge.from).push(edge);
    }
    getNeighbors(id) {
        return this.adjacency.get(id) ?? [];
    }
    static buildFromMemories(items) {
        const graph = new MemoryGraph();
        for (const a of items) {
            for (const b of items) {
                if (a.id === b.id)
                    continue;
                if (a.domain === b.domain) {
                    graph.addEdge({ from: a.id, to: b.id, type: "related_to", weight: 0.5 });
                }
                if (a.sectionPath.length && b.sectionPath.length && a.sectionPath[0] === b.sectionPath[0]) {
                    graph.addEdge({ from: a.id, to: b.id, type: "same_topic", weight: 0.4 });
                }
            }
        }
        return graph;
    }
}
exports.MemoryGraph = MemoryGraph;
