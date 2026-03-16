"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryService_1 = require("../memory/MemoryService");
const memoryGraph_1 = require("../graph/memoryGraph");
const predictionEngine_1 = require("../prediction/predictionEngine");
const reflectionEngine_1 = require("../reflection/reflectionEngine");
const operationLog_1 = require("../cognition/operationLog");
async function main() {
    const memory = new MemoryService_1.MemoryService();
    await memory.loadAll("diagnostics");
    const all = memory.getAll();
    const graph = memoryGraph_1.MemoryGraph.buildFromMemories(all);
    const predictions = (0, predictionEngine_1.generatePredictions)(all);
    const reflections = (0, reflectionEngine_1.generateReflections)(all);
    const opLog = new operationLog_1.OperationLog();
    // Memory stats
    const memoryByDomain = {};
    for (const m of all) {
        memoryByDomain[m.domain] = (memoryByDomain[m.domain] ?? 0) + 1;
    }
    // Graph size
    let edgeCount = 0;
    for (const m of all) {
        edgeCount += graph.getNeighbors(m.id).length;
    }
    // Prediction accuracy proxy
    const avgPredictionConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / (predictions.length || 1);
    // Reflection rate proxy
    const reflectionCount = reflections.insights.length;
    // Agent activity (based on operations log size)
    const fs = await Promise.resolve().then(() => __importStar(require("fs/promises")));
    let opLines = 0;
    try {
        const text = await fs.readFile("memory/operations.log", "utf8");
        opLines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean).length;
    }
    catch {
        opLines = 0;
    }
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({
        memoryStats: {
            total: all.length,
            byDomain: memoryByDomain
        },
        graphStats: {
            nodes: all.length,
            edges: edgeCount
        },
        predictionStats: {
            count: predictions.length,
            averageConfidence: avgPredictionConfidence
        },
        reflectionStats: {
            insightCount: reflectionCount
        },
        agentActivity: {
            operationCount: opLines
        }
    }, null, 2));
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Diagnostics failed", err);
    process.exit(1);
});
