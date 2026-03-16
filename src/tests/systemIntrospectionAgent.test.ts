import assert from "assert";
import { SystemIntrospectionAgent } from "../agents/systemIntrospectionAgent";
import { CognitionCoordinator } from "../cognition/cognitionCoordinator";
import { MemoryService } from "../memory/MemoryService";
import { AgentRegistry } from "../cognition/agentRegistry";
import { OperationLog } from "../cognition/operationLog";
import { ChangeBroadcast } from "../cognition/changeBroadcast";
import { MemoryItem } from "../memory/MemoryItem";

export async function runSystemIntrospectionTests() {
  const memoryService = new MemoryService();
  const agents = new AgentRegistry();
  const opLog = new OperationLog();
  const broadcaster = new ChangeBroadcast();
  const coordinator = new CognitionCoordinator(memoryService, agents, opLog, broadcaster);

  // Seed a few in-memory items directly
  const now = Date.now();
  const sampleMemories: MemoryItem[] = [
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
  (coordinator as any).getAllMemories = () => sampleMemories;

  const agent = new SystemIntrospectionAgent(coordinator);
  const report = await agent.analyze();

  assert.ok(report.metrics.memoryCount >= 1);
  assert.ok(report.alerts.length >= 1);
}

