import { describe, it, expect } from "vitest";
import { PatternCatalog } from "../../core/memory/patternCatalog.js";
describe("PatternCatalog", () => {
    it("tracks prediction outcomes and aggregates stats", () => {
        const catalog = new PatternCatalog();
        catalog.recordOutcome("pred1", true, 1);
        catalog.recordOutcome("pred1", false, 2);
        const stats = catalog.get("pred1");
        expect(stats).toBeTruthy();
        expect(stats?.total).toBe(2);
        expect(stats?.correct).toBe(1);
        expect(stats?.incorrect).toBe(1);
        expect(stats?.lastOutcomeAt).toBe(2);
    });
});
