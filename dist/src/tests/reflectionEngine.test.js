import assert from "assert";
import { generateReflections } from "../reflection/reflectionEngine";
export function runReflectionEngineTests() {
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
    const { insights, counterfactuals } = generateReflections(episodes);
    assert.ok(insights.length >= 1);
    assert.strictEqual(insights.length, counterfactuals.length);
}
