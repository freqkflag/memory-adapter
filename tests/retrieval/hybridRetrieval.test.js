import { describe, it, expect } from "vitest";
import { hybridRetrieve } from "../../src/search/hybridSearch";
import { MemoryGraph } from "../../src/graph/memoryGraph";
describe("Hybrid Retrieval", () => {
    it("combines vector, keyword, and graph relevance", () => {
        const base = {
            text: "",
            domain: "identity",
            durability: "normal",
            sectionPath: [],
            tags: [],
            strength: 0.5,
            importance: 0.5,
            accessCount: 0,
            createdBy: "test",
            updatedBy: "test",
            version: 1,
            timestamp: Date.now()
        };
        const items = [
            { ...base, id: "a", text: "I like step-by-step guidance." },
            { ...base, id: "b", text: "I enjoy exploratory projects." }
        ];
        const graph = MemoryGraph.buildFromMemories(items);
        const results = hybridRetrieve("step-by-step guidance", items, graph, {
            topKVector: 2,
            topKKeyword: 2,
            graphDepth: 1,
            limit: 2
        });
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].item.id).toBe("a");
    });
});
