import assert from "assert";
import { SystemIntrospectionAgent } from "../agents/systemIntrospectionAgent.js";
import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { MemoryService } from "../memory/MemoryService.js";
import { InMemoryDb } from "../core/memory/memoryDb.js";
import { AgentRegistry } from "../cognition/agentRegistry.js";
import { OperationLog } from "../cognition/operationLog.js";
import { ChangeBroadcast } from "../cognition/changeBroadcast.js";
export async function runSystemIntrospectionTests() {
    const memoryService = new MemoryService();
    const db = new InMemoryDb();
    const agents = new AgentRegistry();
    const opLog = new OperationLog();
    const broadcaster = new ChangeBroadcast();
    const coordinator = new CognitionCoordinator(memoryService, db, agents, opLog, broadcaster);
    // Seed a few in-memory items directly
    const now = Date.now();
    const sampleMemories = [
        {
            id: "m1",
            text: "Test identity memory.",
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
            timestamp: now
        }
    ];
    // Patch coordinator's getAllMemories via prototype for this test context
    // to avoid touching internal state.
    coordinator.getAllMemories = () => sampleMemories;
    const agent = new SystemIntrospectionAgent(coordinator);
    const report = await agent.analyze();
    assert.ok(report.metrics.memoryCount >= 1);
    assert.ok(report.alerts.length >= 1);
    assert.ok(report.memoryStats.totalCount >= 1);
    assert.ok(report.anomalySignals.signals.length >= 0);
}
