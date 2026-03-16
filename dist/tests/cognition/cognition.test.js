import { describe, it, expect } from "vitest";
import { OperationLog } from "../../src/cognition/operationLog.js";
import { resolveDuplicateWrites } from "../../src/cognition/conflictResolver.js";
describe("Shared Cognition", () => {
    it("records operations to the log", async () => {
        const opLog = new OperationLog();
        const op = await opLog.record({
            agentId: "test-agent",
            action: "test_action",
            payload: { x: 1 }
        });
        expect(op.id).toBeDefined();
    });
    it("resolves conflicting memory writes", () => {
        const base = {
            id: "m1",
            text: "Original text",
            domain: "identity",
            durability: "normal",
            sectionPath: [],
            tags: ["a"],
            strength: 0.5,
            importance: 0.5,
            accessCount: 0,
            createdBy: "test",
            updatedBy: "test",
            version: 1,
            timestamp: Date.now()
        };
        const incoming = {
            ...base,
            text: "Original text (updated)",
            tags: ["b"],
            version: 2
        };
        const result = resolveDuplicateWrites(base, incoming);
        expect(result.conflict).toBe(true);
        expect(result.item.tags).toContain("a");
        expect(result.item.tags).toContain("b");
        expect(result.item.version).toBeGreaterThan(base.version);
    });
});
