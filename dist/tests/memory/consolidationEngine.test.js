import { describe, it, expect, vi } from "vitest";
import { clusterEpisodes, generateInsightCandidates } from "../../core/memory/consolidationEngine.js";
import { MemoryService } from "../../memory/MemoryService.js";
import * as fs from "node:fs";
describe("consolidationEngine", () => {
    it("clusters episodes by domain and time", async () => {
        const now = Date.now();
        const episodes = [
            { id: "e1", text: "A", domain: "identity", timestamp: now - 1000 },
            { id: "e2", text: "B", domain: "identity", timestamp: now },
            { id: "e3", text: "C", domain: "projects", timestamp: now }
        ];
        const clusters = await clusterEpisodes(episodes);
        expect(clusters.length).toBeGreaterThanOrEqual(2);
    });
    it("generates insight candidates from clusters", async () => {
        const fsSpy = vi.spyOn(fs.promises, "readFile").mockResolvedValue("");
        const memoryService = new MemoryService();
        const episodes = [
            { id: "e1", text: "Working on projects.", domain: "projects", timestamp: Date.now() }
        ];
        const clusters = await clusterEpisodes(episodes);
        const insights = await generateInsightCandidates(clusters, memoryService);
        expect(Array.isArray(insights)).toBe(true);
        fsSpy.mockRestore();
    });
});
