"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryService_1 = require("../src/memory/MemoryService");
const elangParser_1 = require("../src/emotion/elangParser");
const memoryGraph_1 = require("../src/graph/memoryGraph");
const graphTraversal_1 = require("../src/graph/graphTraversal");
const rankAndFilter_1 = require("../src/ranking/rankAndFilter");
const retrievalProfiles_1 = require("../src/ranking/retrievalProfiles");
const reflectionEngine_1 = require("../src/reflection/reflectionEngine");
const predictionEngine_1 = require("../src/prediction/predictionEngine");
const predictionScoring_1 = require("../src/prediction/predictionScoring");
const conflictResolver_1 = require("../src/cognition/conflictResolver");
const ids_1 = require("../src/utils/ids");
const server_1 = require("../src/mcp/server");
async function main() {
    const memoryService = new MemoryService_1.MemoryService();
    await memoryService.loadDomain("identity", "validator");
    await memoryService.loadDomain("timeline", "validator");
    await memoryService.loadDomain("current-state", "validator");
    await memoryService.loadDomain("creative", "validator");
    await memoryService.loadDomain("projects", "validator");
    const allMemories = memoryService.getAll();
    console.log(`Loaded ${allMemories.length} memory items.`);
    const elang = (0, elangParser_1.parseELang)("valence=0.4,arousal=0.7 -> valence=0.1,arousal=0.2");
    console.log("Parsed E-Lang vector with axes:", Object.keys(elang.axes));
    const graph = new memoryGraph_1.MemoryGraph();
    if (allMemories.length >= 2) {
        graph.addEdge({
            from: allMemories[0].id,
            to: allMemories[1].id,
            type: "related_to"
        });
    }
    const visited = (0, graphTraversal_1.traverseGraph)(graph, allMemories.slice(0, 1).map((m) => m.id), 2);
    console.log("Graph traversal visited nodes:", visited.length);
    const ranked = (0, rankAndFilter_1.rankAndFilter)("identity project", allMemories, { graph, profile: retrievalProfiles_1.DEFAULT_RETRIEVAL_PROFILE });
    console.log("Ranking produced items:", ranked.length);
    const reflections = (0, reflectionEngine_1.generateReflections)(allMemories);
    console.log("Reflection insights:", reflections.insights.length);
    const predictions = (0, predictionEngine_1.generatePredictions)(allMemories);
    const scores = predictions.map(predictionScoring_1.scorePrediction);
    console.log("Prediction scores:", scores);
    if (allMemories.length >= 2) {
        const conflict = (0, conflictResolver_1.resolveDuplicateWrites)(allMemories[0], allMemories[1]);
        console.log("Conflict resolution type:", conflict.type);
    }
    (0, server_1.startServer)(7070);
    console.log("Local MCP-style server listening on http://localhost:7070/health");
    console.log("Validation run complete. Generated run id:", (0, ids_1.generateId)("run"));
}
main().catch((err) => {
    console.error("Validation failed:", err);
    process.exitCode = 1;
});
const path_1 = __importDefault(require("path"));
async function main() {
    const baseDir = path_1.default.resolve(process.cwd());
    const service = new MemoryService_1.MemoryService(baseDir);
    console.log("== getUserSummary ==");
    const summary = service.getUserSummary();
    if (!summary.ok || !summary.data) {
        throw new Error(summary.error ?? "getUserSummary failed");
    }
    console.log(summary.data.split("\n").slice(0, 10).join("\n"));
    console.log("\n== getRelevantContext('tattoo') ==");
    const ctx = await service.getRelevantContext({ query: "tattoo", limit: 5 });
    if (!ctx.ok || !ctx.data) {
        throw new Error(ctx.error ?? "getRelevantContext failed");
    }
    ctx.data.forEach((item) => {
        console.log(`- [${item.domain}/${item.durability}] ${item.sourceFile} :: ${item.sectionPath.join(" > ")} :: ${item.text}`);
    });
    console.log("\n== explainRelevantContext('tattoo') ==");
    const explained = await service.explainRelevantContext({
        query: "tattoo",
        limit: 5,
    });
    if (!explained.ok || !explained.data) {
        throw new Error(explained.error ?? "explainRelevantContext failed");
    }
    console.log(JSON.stringify({
        intent: explained.data.intent,
        firstResult: explained.data.results[0],
    }, null, 2));
    console.log("\n== memory hygiene (dry-run) ==");
    const hygiene = service.runHygiene(true);
    if (!hygiene.ok || !hygiene.data) {
        throw new Error(hygiene.error ?? "runHygiene failed");
    }
    console.log(JSON.stringify({
        archivedCount: hygiene.data.archived.length,
        promotedCount: hygiene.data.promoted.length,
        lowStrengthCount: hygiene.data.lowStrength.length,
        duplicatesMergedCount: hygiene.data.duplicatesMerged.length,
    }, null, 2));
    console.log("\n== reflection engine (episodes sample) ==");
    const episodes = [
        {
            id: "ep1",
            text: "I felt overwhelmed by too many details and needed calm explanations.",
            timestamp: Date.now(),
        },
        {
            id: "ep2",
            text: "I was excited about new tattoo flash ideas and creative designs.",
            timestamp: Date.now(),
        },
        {
            id: "ep3",
            text: "I stressed about budget planning and money again.",
            timestamp: Date.now(),
        },
    ];
    const reflection = service.generateReflection(episodes);
    if (!reflection.ok || !reflection.data) {
        throw new Error(reflection.error ?? "generateReflection failed in validation");
    }
    console.log(JSON.stringify({
        summariesCount: reflection.data.summaries.length,
        insightsCount: reflection.data.insights.length,
        promotedCount: reflection.data.promotedTexts.length,
    }, null, 2));
    console.log("\n== cognition: agent registry and op log ==");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { AgentRegistry } = require("../src/cognition/agentRegistry");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { OperationLog } = require("../src/cognition/operationLog");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { CognitionCoordinator } = require("../src/cognition/cognitionCoordinator");
    const registry = new AgentRegistry(baseDir);
    const a1 = registry.registerAgent("Test ChatGPT", "chatgpt");
    const a2 = registry.registerAgent("Test Claude", "claude");
    const opLog = new OperationLog(baseDir);
    const coordinator = new CognitionCoordinator(baseDir);
    const items = service["loadAll"]();
    if (items.length > 0) {
        const target = items[0];
        coordinator.seed([target]);
        coordinator.applyOperation({
            agentId: a1.id,
            action: "tag_update",
            targetMemoryId: target.id,
            payload: { tags: [...target.tags, "test-tag"] },
        });
        coordinator.applyOperation({
            agentId: a2.id,
            action: "text_edit",
            targetMemoryId: target.id,
            payload: { text: target.text },
        });
    }
    const tail = opLog.tail(5);
    console.log(JSON.stringify({
        agentsRegistered: [a1.id, a2.id],
        opLogCount: tail.length,
    }, null, 2));
    console.log("\nValidation completed successfully.");
}
main().catch((err) => {
    console.error("Validation script failed:", err);
    process.exit(1);
});
