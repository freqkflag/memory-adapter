import { describe, it, expect, vi } from "vitest";
import { ReflectionAgent } from "../../agents/reflectionAgent.js";

// Minimal coordinator stub for testing the mode plumbing.
const makeCoordinator = () => ({
  getAllMemories: vi.fn(() => []),
  getOperationLog: vi.fn(() => ({
    record: vi.fn()
  })),
  logOperation: vi.fn(async () => {})
});

describe("ReflectionAgent with reflection modes", () => {
  it("defaults to no mode when omitted", async () => {
    const coordinator = makeCoordinator() as any;
    const agent = new ReflectionAgent(coordinator);

    const result = await agent.reflect();

    expect(result.mode).toBeUndefined();
  });

  it("accepts identityConsolidation mode", async () => {
    const coordinator = makeCoordinator() as any;
    const agent = new ReflectionAgent(coordinator);

    const result = await agent.reflect("identityConsolidation");

    expect(result.mode).toBe("identityConsolidation");
    expect(result.profile?.id).toBe("identityConsolidation");
  });
});

