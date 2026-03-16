import { describe, it, expect } from "vitest";
import { generatePredictions } from "../../../src/prediction/predictionEngine";
import { scorePrediction } from "../../../src/prediction/predictionScoring";
import { MemoryItem } from "../../../src/memory/MemoryItem";

const makeItem = (id: string, domain: string): MemoryItem => ({
  id,
  text: `Sample in ${domain}`,
  domain,
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

describe("Prediction engine", () => {
  it("creates predictions from recurring domains and scores them", () => {
    const items: MemoryItem[] = [
      makeItem("a", "projects"),
      makeItem("b", "projects"),
      makeItem("c", "identity")
    ];
    const preds = generatePredictions(items);
    expect(preds.length).toBeGreaterThan(0);
    const s = scorePrediction(preds[0]);
    expect(s).toBeGreaterThan(0);
  });
});

