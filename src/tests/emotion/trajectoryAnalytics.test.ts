import { describe, it, expect } from "vitest";
import type { ELangVector } from "../../emotion/elangVectorModel.js";
import { computeEmotionalDriftOverLastN } from "../../core/emotion/trajectoryAnalytics.js";

describe("trajectoryAnalytics", () => {
  it("computes drift over last N events", () => {
    const baseTime = Date.now();
    const events: ELangVector[] = [
      { axes: { joy: 0.1 }, timestamp: baseTime - 3000, source: "user" },
      { axes: { joy: 0.3 }, timestamp: baseTime - 2000, source: "user" },
      { axes: { joy: 0.6 }, timestamp: baseTime - 1000, source: "user" }
    ];

    const drift = computeEmotionalDriftOverLastN(events, 3);

    expect(drift.count).toBe(3);
    expect(drift.axisDeltas.joy).toBeCloseTo(0.5, 3);
    expect(drift.axisAverageChanges.joy).toBeGreaterThan(0);
  });

  it("handles empty input", () => {
    const drift = computeEmotionalDriftOverLastN([], 5);
    expect(drift.count).toBe(0);
  });
});

