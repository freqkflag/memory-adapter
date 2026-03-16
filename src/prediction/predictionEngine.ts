import { PredictionPattern, minePatterns } from "./patternMining";
import { hoursFromNow } from "../utils/time";
import { generateId } from "../utils/ids";
import { MemoryItem } from "../memory/MemoryItem";

export interface Prediction {
  id: string;
  prediction: string;
  confidence: number;
  supportingMemories: string[];
  createdAt: number;
  expiresAt?: number;
}

export function generatePredictions(memories: MemoryItem[]): Prediction[] {
  const patterns: PredictionPattern[] = minePatterns(memories);
  const createdAt = Date.now();
  const expiresAt = hoursFromNow(72);

  return patterns.map((pattern) => ({
    id: generateId("pred"),
    prediction: pattern.description,
    confidence: 0.6,
    supportingMemories: pattern.supportingIds,
    createdAt,
    expiresAt
  }));
}

