"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryService_1 = require("../memory/MemoryService");
const elangParser_1 = require("../emotion/elangParser");
const memoryGraph_1 = require("../graph/memoryGraph");
const graphTraversal_1 = require("../graph/graphTraversal");
const hybridSearch_1 = require("../search/hybridSearch");
const reflectionEngine_1 = require("../reflection/reflectionEngine");
const predictionEngine_1 = require("../prediction/predictionEngine");
const conflictResolver_1 = require("../cognition/conflictResolver");
async function run() {
    const memory = new MemoryService_1.MemoryService();
    await memory.loadAll("validator");
    const all = memory.getAll();
    // Memory parsing
    // eslint-disable-next-line no-console
    console.log("Memory items loaded:", all.length);
    // E-Lang parsing
    const elang = (0, elangParser_1.parseELang)("valence:0.5, arousal:0.2 -> valence:0.6, arousal:0.3");
    // eslint-disable-next-line no-console
    console.log("E-Lang axes:", Object.keys(elang.axes));
    // Retrieval ranking and graph traversal
    const graph = memoryGraph_1.MemoryGraph.buildFromMemories(all);
    const traversal = (0, graphTraversal_1.traverseGraph)(graph, all.slice(0, 1).map((m) => m.id), 2);
    // eslint-disable-next-line no-console
    console.log("Graph traversal nodes:", traversal.length);
    const retrieval = (0, hybridSearch_1.hybridRetrieve)("identity", all, graph);
    // eslint-disable-next-line no-console
    console.log("Hybrid retrieval results:", retrieval.length);
    // Reflection generation
    const reflections = (0, reflectionEngine_1.generateReflections)(all);
    // eslint-disable-next-line no-console
    console.log("Insights:", reflections.insights.length);
    // Prediction scoring
    const predictions = (0, predictionEngine_1.generatePredictions)(all);
    const activeCount = predictions.filter(predictionEngine_1.isPredictionActive).length;
    // eslint-disable-next-line no-console
    console.log("Predictions (active):", activeCount);
    // Conflict resolution
    if (all.length >= 1) {
        const base = { ...all[0] };
        const incoming = { ...all[0], text: base.text + " (updated)" };
        const resolved = (0, conflictResolver_1.resolveDuplicateWrites)(base, incoming);
        // eslint-disable-next-line no-console
        console.log("Conflict detected:", resolved.conflict);
    }
}
run().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Validation failed", err);
    process.exit(1);
});
