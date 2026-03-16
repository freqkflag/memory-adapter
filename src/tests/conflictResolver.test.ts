import assert from "assert";
import { resolveDuplicateWrites } from "../cognition/conflictResolver.js";
import { MemoryItem } from "../memory/MemoryItem.js";

export function runConflictResolverTests() {
  const base: MemoryItem = {
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

  const incoming: MemoryItem = {
    ...base,
    text: "Original text (updated)",
    tags: ["b"],
    version: 2
  };

  const result = resolveDuplicateWrites(base, incoming);
  assert.ok(result.conflict);
  assert.ok(result.item.tags.includes("a"));
  assert.ok(result.item.tags.includes("b"));
  assert.ok(result.item.version > base.version);
}

