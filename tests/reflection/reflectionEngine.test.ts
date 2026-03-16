import { describe, it, expect } from "vitest";
import { generateReflections } from "../../src/reflection/reflectionEngine.js";
import { MemoryItem } from "../../src/memory/MemoryItem.js";

describe("Reflection Engine", () => {
  const base: Omit<MemoryItem, "id"> = {
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

  it("generates insights and paired counterfactuals", () => {
    const episodes: MemoryItem[] = [
      { ...base, id: "e1", text: "Identity work episode 1." },
      { ...base, id: "e2", text: "Identity work episode 2." },
      { ...base, id: "e3", text: "Identity work episode 3." },
      { ...base, id: "e4", text: "Identity work episode 4." }
    ];

    const { insights, counterfactuals } = generateReflections(episodes);
    expect(insights.length).toBeGreaterThan(0);
    expect(counterfactuals.length).toBe(insights.length);
  });
});

