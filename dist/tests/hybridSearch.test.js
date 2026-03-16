"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runHybridSearchTests = runHybridSearchTests;
const assert_1 = __importDefault(require("assert"));
const hybridSearch_1 = require("../search/hybridSearch");
const memoryGraph_1 = require("../graph/memoryGraph");
function runHybridSearchTests() {
    const base = {
        text: "",
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
        timestamp: Date.now()
    };
    const items = [
        { ...base, id: "a", text: "I like step-by-step guidance." },
        { ...base, id: "b", text: "I enjoy exploratory projects." }
    ];
    const graph = memoryGraph_1.MemoryGraph.buildFromMemories(items);
    const results = (0, hybridSearch_1.hybridRetrieve)("step-by-step", items, graph, {
        topKVector: 2,
        topKKeyword: 2,
        graphDepth: 1,
        limit: 2
    });
    assert_1.default.ok(results.length >= 1);
    assert_1.default.strictEqual(results[0].item.id, "a");
}
