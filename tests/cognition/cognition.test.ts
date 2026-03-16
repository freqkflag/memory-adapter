import { describe, it, expect } from "vitest";
import { AgentRegistry } from "../../../src/cognition/agentRegistry";
import { createOperation, Operation } from "../../../src/cognition/operationLog";
import { resolveDuplicateWrites } from "../../../src/cognition/conflictResolver";
import { MemoryItem } from "../../../src/memory/MemoryItem";

const makeItem = (id: string, text: string, tags: string[] = []): MemoryItem => ({
  id,
  text,
  domain: "identity",
  durability: "medium-term",
  sectionPath: [],
  tags,
  strength: 0.5,
  importance: 0.5,
  accessCount: 0,
  createdBy: "agent",
  updatedBy: "agent",
  version: 1,
  timestamp: Date.now()
});

describe("Cognition layer", () => {
  it("registers agents and updates lastSeen", () => {
    const registry = new AgentRegistry();
    registry.register({ id: "a1", name: "Agent", type: "test", lastSeen: 0 });
    registry.updateLastSeen("a1", 123);
    const agents = registry.list();
    expect(agents.length).toBe(1);
    expect(agents[0].lastSeen).toBe(123);
  });

  it("creates operations suitable for logging", () => {
    const base: Omit<Operation, "id" | "timestamp"> = {
      agentId: "a1",
      action: "write",
      targetMemoryId: "m1",
      payload: { text: "hello" }
    };
    const op = createOperation(base);
    expect(op.id).toMatch(/^op_/);
    expect(op.timestamp).toBeGreaterThan(0);
  });

  it("resolves duplicate writes by merging tags and text", () => {
    const a = makeItem("m1", "text", ["a"]);
    const b = makeItem("m1", "text", ["b"]);
    const res = resolveDuplicateWrites(a, b);
    expect(res.type).toBe("merged");
    expect(res.item.tags.sort()).toEqual(["a", "b"]);
  });
});

