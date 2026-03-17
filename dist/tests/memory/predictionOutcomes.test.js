import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import { recordPredictionOutcome, getPatternCatalog } from "../../core/memory/predictionOutcomes.js";
describe("predictionOutcomes", () => {
    let appendSpy;
    let mkdirSpy;
    beforeEach(() => {
        appendSpy = vi.spyOn(fs.promises, "appendFile");
        mkdirSpy = vi.spyOn(fs.promises, "mkdir");
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it("updates catalog and appends to markdown file", async () => {
        appendSpy.mockResolvedValue(undefined);
        mkdirSpy.mockResolvedValue(undefined);
        await recordPredictionOutcome("pred-test", true);
        const stats = getPatternCatalog().get("pred-test");
        expect(stats).toBeTruthy();
        expect(stats?.total).toBe(1);
        expect(stats?.correct).toBe(1);
        expect(mkdirSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
    });
});
