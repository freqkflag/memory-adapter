import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import { recordPredictionOutcome, getPatternCatalog } from "../../core/memory/predictionOutcomes.js";

describe("predictionOutcomes", () => {
  let appendSpy: ReturnType<typeof vi.spyOn>;
  let mkdirSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    appendSpy = vi.spyOn(fs.promises, "appendFile" as any);
    mkdirSpy = vi.spyOn(fs.promises, "mkdir" as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates catalog and appends to markdown file", async () => {
    appendSpy.mockResolvedValue(undefined as any);
    mkdirSpy.mockResolvedValue(undefined as any);

    await recordPredictionOutcome("pred-test", true);

    const stats = getPatternCatalog().get("pred-test");
    expect(stats).toBeTruthy();
    expect(stats?.total).toBe(1);
    expect(stats?.correct).toBe(1);

    expect(mkdirSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });
});

