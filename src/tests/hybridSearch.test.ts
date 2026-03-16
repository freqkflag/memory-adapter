import assert from "assert";
import { hybridRetrieve } from "../search/hybridSearch";
import { MemoryGraph } from "../graph/memoryGraph";
import { MemoryItem } from "../memory/MemoryItem";

export function runHybridSearchTests() {
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

  const items: MemoryItem[] = [
    { ...base, id: "a", text: "I like step-by-step guidance." },
    { ...base, id: "b", text: "I enjoy exploratory projects." }
  ];

  const graph = MemoryGraph.buildFromMemories(items);
  const results = hybridRetrieve("step-by-step", items, graph, {
    topKVector: 2,
    topKKeyword: 2,
    graphDepth: 1,
    limit: 2
  });

  assert.ok(results.length >= 1);
  assert.strictEqual(results[0].item.id, "a");
}

