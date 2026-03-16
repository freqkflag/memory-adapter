"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runReflectionEngineTests = runReflectionEngineTests;
const assert_1 = __importDefault(require("assert"));
const reflectionEngine_1 = require("../reflection/reflectionEngine");
function runReflectionEngineTests() {
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
    const episodes = [
        { ...base, id: "e1", domain: "identity", text: "User works on identity a lot." },
        { ...base, id: "e2", domain: "identity", text: "Another identity-related episode." },
        { ...base, id: "e3", domain: "identity", text: "More identity work." },
        { ...base, id: "e4", domain: "identity", text: "Continued identity focus." }
    ];
    const { insights, counterfactuals } = (0, reflectionEngine_1.generateReflections)(episodes);
    assert_1.default.ok(insights.length >= 1);
    assert_1.default.strictEqual(insights.length, counterfactuals.length);
}
