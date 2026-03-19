import { normalizeText } from "../utils/text.js";
import { computeMemoryStats } from "../core/memory/memoryStats.js";
import { detectTemporalAnomaly } from "../core/memory/temporalAnomalyDetector.js";
import { getPamDataDir, pamDataFile } from "../config/runtime.js";
export class SystemIntrospectionAgent {
    coordinator;
    id = "system-introspection";
    name = "System Introspection Agent";
    type = "systemIntrospectionAgent";
    constructor(coordinator) {
        this.coordinator = coordinator;
    }
    async analyze() {
        const memories = this.coordinator.getAllMemories();
        const opLog = this.coordinator.getOperationLog();
        const ops = await this.readOperations(opLog);
        const metrics = this.computeMetrics(memories, ops);
        const memoryStats = computeMemoryStats(memories);
        const anomalySignals = detectTemporalAnomaly(memories);
        const alerts = this.generateAlerts(metrics);
        await this.coordinator.logOperation({
            agentId: this.id,
            action: "system_introspection",
            payload: {
                metrics,
                memoryStats,
                anomalySignals
            }
        });
        return { metrics, alerts, memoryStats, anomalySignals };
    }
    async readOperations(opLog) {
        // Re-open the log file to compute metrics; keep OperationLog write-only for normal flow.
        const fs = await import("node:fs/promises");
        const path = pamDataFile("operations.log");
        let text = "";
        try {
            text = await fs.readFile(path, "utf8");
        }
        catch (err) {
            if (err && err.code === "ENOENT") {
                // If the log does not exist yet, treat as empty and create it for future writes.
                await fs.mkdir(getPamDataDir(), { recursive: true });
                await fs.writeFile(path, "", "utf8");
                return [];
            }
            throw err;
        }
        const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
        const ops = [];
        for (const line of lines) {
            try {
                const parsed = JSON.parse(line);
                ops.push(parsed);
            }
            catch {
                // ignore malformed lines
            }
        }
        return ops;
    }
    computeMetrics(memories, ops) {
        const memoryCount = memories.length;
        const memoryByDomain = {};
        for (const m of memories) {
            memoryByDomain[m.domain] = (memoryByDomain[m.domain] ?? 0) + 1;
        }
        const now = Date.now();
        const last24h = now - 24 * 60 * 60 * 1000;
        const recentMemories = memories.filter((m) => m.timestamp >= last24h).length;
        const approximateMemoryGrowth24h = recentMemories;
        const retrievalOps = ops.filter((o) => o.action === "retrieve");
        const retrievalCount = retrievalOps.length;
        const averageRetrievedItems = retrievalOps.reduce((sum, o) => sum + (typeof o.payload?.resultCount === "number" ? o.payload.resultCount : 0), 0) /
            (retrievalCount || 1);
        const predictionDomainMemories = memories.filter((m) => m.domain === "prediction");
        const predictionCount = predictionDomainMemories.length;
        // Prediction accuracy proxy: average of embedded confidence values if present
        let confidenceSum = 0;
        let confidenceSeen = 0;
        for (const m of predictionDomainMemories) {
            const match = m.text.match(/confidence:\s*([0-9.]+)/i);
            if (match) {
                const c = Number(match[1]);
                if (Number.isFinite(c)) {
                    confidenceSum += c;
                    confidenceSeen += 1;
                }
            }
        }
        const averagePredictionConfidence = confidenceSeen ? confidenceSum / confidenceSeen : 0;
        // Memory clutter proxy: ratio of low-strength, low-importance, duplicate-like memories
        const normalizedTexts = new Map();
        let clutterCandidates = 0;
        for (const m of memories) {
            const norm = normalizeText(m.text);
            normalizedTexts.set(norm, (normalizedTexts.get(norm) ?? 0) + 1);
            if (m.strength < 0.3 && m.importance < 0.3) {
                clutterCandidates += 1;
            }
        }
        const duplicateCount = Array.from(normalizedTexts.values()).filter((c) => c > 1).length;
        const clutterRatio = memoryCount
            ? (clutterCandidates + duplicateCount) / memoryCount
            : 0;
        return {
            memoryCount,
            memoryByDomain,
            approximateMemoryGrowth24h,
            retrievalCount,
            averageRetrievedItems,
            predictionCount,
            averagePredictionConfidence,
            clutterRatio
        };
    }
    generateAlerts(metrics) {
        const alerts = [];
        if (metrics.retrievalCount >= 5 && metrics.averageRetrievedItems < 2) {
            alerts.push("retrieval accuracy may be dropping (few items returned per query).");
        }
        if (metrics.clutterRatio > 0.4 && metrics.memoryCount > 50) {
            alerts.push("memory clutter increasing (many low-strength or duplicate memories).");
        }
        if (metrics.predictionCount > 0 && metrics.averagePredictionConfidence < 0.3) {
            alerts.push("prediction confidence trending low; review predictive patterns.");
        }
        if (alerts.length === 0) {
            alerts.push("system operating within normal heuristic ranges.");
        }
        return alerts;
    }
}
