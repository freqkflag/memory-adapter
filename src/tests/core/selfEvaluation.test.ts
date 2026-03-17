import { describe, it, expect, vi } from "vitest";
import { computeHealthSnapshot } from "../../core/analytics/selfEvaluation.js";
import type { CognitionCoordinator } from "../../cognition/cognitionCoordinator.js";
import type { MemoryItem } from "../../memory/MemoryItem.js";

const makeCoordinator = (memories: MemoryItem[]): CognitionCoordinator =>
  ({
    getAllMemories: vi.fn(() => memories)
  } as any);

describe("selfEvaluation", () => {
  it("computes a health snapshot with memory stats and anomaly signals", async () => {
    const now = Date.now();
    const memories: MemoryItem[] = [
      {
        id: "m1",
        text: "Identity note.",
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

    const coordinator = makeCoordinator(memories);
    const snapshot = await computeHealthSnapshot(coordinator);

    expect(snapshot.memoryStats.totalCount).toBe(1);
    expect(Array.isArray(snapshot.anomalySignals.signals)).toBe(true);
  });
});

