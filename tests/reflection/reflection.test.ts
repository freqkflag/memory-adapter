import { describe, it, expect } from "vitest";
import { generateReflections } from "../../../src/reflection/reflectionEngine";
import { MemoryItem } from "../../../src/memory/MemoryItem";

const makeEpisode = (id: string, text: string, tags: string[] = []): MemoryItem => ({
  id,
  text,
  domain: "timeline",
  durability: "medium-term",
  sectionPath: [],
  tags,
  strength: 0.5,
  importance: 0.5,
  accessCount: 0,
  createdBy: "test",
  updatedBy: "test",
  version: 1,
  timestamp: Date.now()
});

describe("Reflection engine", () => {
  it("generates insights from repeated patterns", () => {
    const episodes: MemoryItem[] = [
      makeEpisode("e1", "User mentions tattoo budget", ["tattoo", "budget"]),
      makeEpisode("e2", "Another episode about tattoo", ["tattoo"])
    ];
    const result = generateReflections(episodes);
    expect(result.insights.length).toBeGreaterThan(0);
    const first = result.insights[0];
    expect(first.evidenceEpisodes.length).toBeGreaterThan(0);
    expect(first.confidence).toBeGreaterThanOrEqual(0);
  });
});

