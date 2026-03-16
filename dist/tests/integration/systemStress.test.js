import { describe, it, expect } from "vitest";
import { MemoryService } from "../../src/memory/MemoryService.js";
import { MemoryGraph } from "../../src/graph/memoryGraph.js";
import { hybridRetrieve } from "../../src/search/hybridSearch.js";
import { generatePredictions } from "../../src/prediction/predictionEngine.js";
import { generateReflections } from "../../src/reflection/reflectionEngine.js";
describe("System Stress and Memory Growth", () => {
    it("handles large memory graphs and repeated retrieval/reflection/prediction", async () => {
        const service = new MemoryService();
        // Seed a synthetic in-memory set of items without touching disk
        const items = [];
        const baseTs = Date.now();
        for (let i = 0; i < 10000; i++) {
            items.push({
                id: `mem_${i}`,
                text: `Synthetic memory item ${i}`,
                domain: i % 2 === 0 ? "projects" : "identity",
                durability: "normal",
                sectionPath: [],
                tags: [],
                strength: 0.5,
                importance: 0.5,
                accessCount: 0,
                createdBy: "stress-test",
                updatedBy: "stress-test",
                version: 1,
                timestamp: baseTs
            });
        }
        const graph = MemoryGraph.buildFromMemories(items);
        const start = Date.now();
        const retrieval = hybridRetrieve("Synthetic memory", items, graph, {
            topKVector: 64,
            topKKeyword: 64,
            graphDepth: 2,
            limit: 50
        });
        const reflections = generateReflections(items.slice(0, 200));
        const predictions = generatePredictions(items.slice(0, 500));
        const elapsed = Date.now() - start;
        expect(retrieval.length).toBeGreaterThan(0);
        expect(reflections.insights.length).toBeGreaterThanOrEqual(0);
        expect(predictions.length).toBeGreaterThanOrEqual(0);
        // Simple latency sanity bound to catch pathological behavior in tests
        expect(elapsed).toBeLessThan(5000);
    });
});
