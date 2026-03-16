import { describe, it, expect } from "vitest";
import { MemoryItem } from "../../src/memory/MemoryItem";
import { MemoryGraph } from "../../src/graph/memoryGraph";
import { traverseGraph } from "../../src/graph/graphTraversal";
import { rankAndFilter } from "../../src/ranking/rankAndFilter";
import { DEFAULT_RETRIEVAL_PROFILE } from "../../src/ranking/retrievalProfiles";

const makeItem = (id: string, text: string): MemoryItem => ({
  id,
  text,
  domain: "projects",
  durability: "medium-term",
  sectionPath: [],
  tags: ["stress-test"],
  strength: 0.5,
  importance: 0.5,
  accessCount: 0,
  createdBy: "stress",
  updatedBy: "stress",
  version: 1,
  timestamp: Date.now()
});

describe("System stress scenarios", () => {
  it("handles large in-memory graph and ranking set", () => {
    const items: MemoryItem[] = [];
    for (let i = 0; i < 10000; i++) {
      items.push(makeItem(`m${i}`, `Project memory ${i}`));
    }
    const graph = new MemoryGraph();
    for (let i = 0; i < items.length - 1; i++) {
      graph.addEdge({ from: items[i].id, to: items[i + 1].id, type: "same_project" });
    }
    const visited = traverseGraph(graph, [items[0].id], 3);
    expect(visited.length).toBeGreaterThan(1);
    const ranked = rankAndFilter(
      "project",
      items,
      { graph, profile: DEFAULT_RETRIEVAL_PROFILE }
    );
    expect(ranked.length).toBeGreaterThan(0);
  });
});

