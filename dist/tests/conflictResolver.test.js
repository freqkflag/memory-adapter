"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runConflictResolverTests = runConflictResolverTests;
const assert_1 = __importDefault(require("assert"));
const conflictResolver_1 = require("../cognition/conflictResolver");
function runConflictResolverTests() {
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
    const result = (0, conflictResolver_1.resolveDuplicateWrites)(base, incoming);
    assert_1.default.ok(result.conflict);
    assert_1.default.ok(result.item.tags.includes("a"));
    assert_1.default.ok(result.item.tags.includes("b"));
    assert_1.default.ok(result.item.version > base.version);
}
