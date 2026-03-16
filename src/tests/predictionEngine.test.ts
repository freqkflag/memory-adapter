import assert from "assert";
import { generatePredictions, isPredictionActive } from "../prediction/predictionEngine.js";
import { MemoryItem } from "../memory/MemoryItem.js";

export function runPredictionEngineTests() {
  const base: Omit<MemoryItem, "id"> = {
    text: "",
    domain: "projects",
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

  const memories: MemoryItem[] = [
    { ...base, id: "p1", text: "Working on projects frequently." },
    { ...base, id: "p2", text: "Another project-focused memory." }
  ];

  const predictions = generatePredictions(memories);
  if (predictions.length > 0) {
    const p = predictions[0];
    assert.ok(isPredictionActive(p));
    assert.ok(p.expiresAt && p.expiresAt > p.createdAt);
  }
}

