import { describe, it, expect } from "vitest";
import { vectorSearch } from "../../../src/search/vectorSearch";
import { keywordSearch } from "../../../src/search/keywordSearch";
import { MemoryItem } from "../../../src/memory/MemoryItem";
import { MemoryGraph, GraphEdge } from "../../../src/graph/memoryGraph";
import { traverseGraph } from "../../../src/graph/graphTraversal";

const makeItem = (id: string, text: string): MemoryItem => ({
  id,
  text,
  domain: "identity",
  durability: "medium-term",
  sectionPath: [],
  tags: [],
  strength: 0.5,
  importance: 0.5,
  accessCount: 0,
  createdBy: "test",
  updatedBy: "test",
  version: 1,
  timestamp: Date.now()
});

describe("Hybrid retrieval primitives", () => {
  const items: MemoryItem[] = [
    makeItem("a", "Current project tattoo design"),
    makeItem("b", "Long term life timeline entry"),
    makeItem("c", "Random note")
  ];

  it("computes simple vector similarity", () => {
    const results = vectorSearch("project", items);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.id).toBe("a");
  });

  it("computes keyword overlap", () => {
    const results = keywordSearch("timeline", items);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.id).toBe("b");
  });

  it("traverses memory graph with configurable depth", () => {
    const graph = new MemoryGraph();
    const edges: GraphEdge[] = [
      { from: "a", to: "b", type: "related_to" },
      { from: "b", to: "c", type: "related_to" }
    ];
    edges.forEach((e) => graph.addEdge(e));
    const visitedDepth1 = traverseGraph(graph, ["a"], 1);
    const visitedDepth2 = traverseGraph(graph, ["a"], 2);
    expect(visitedDepth1).toContain("b");
    expect(visitedDepth2).toContain("c");
  });
});

