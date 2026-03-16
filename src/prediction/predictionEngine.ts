import { MemoryItem } from "../memory/MemoryItem.js";
import { minePredictivePatterns } from "./patternMining.js";
import { scorePrediction } from "./predictionScoring.js";
import { generateId } from "../utils/ids.js";
import { hoursFromNow } from "../utils/time.js";

export interface Prediction {
  id: string;
  prediction: string;
  confidence: number;
  supportingMemories: string[];
  createdAt: number;
  expiresAt?: number;
}

export function generatePredictions(memories: MemoryItem[]): Prediction[] {
  const patterns = minePredictivePatterns(memories);
  const predictions: Prediction[] = [];
  const createdAt = Date.now();
  const expiresAt = hoursFromNow(72);

  for (const pattern of patterns) {
    const confidence = scorePrediction(pattern, memories);
    const supportingMemories = memories.map((m) => m.id);
    predictions.push({
      id: generateId("pred"),
      prediction: pattern,
      confidence,
      supportingMemories,
      createdAt,
      expiresAt
    });
  }

  return predictions;
}

export function isPredictionActive(prediction: Prediction): boolean {
  if (!prediction.expiresAt) return true;
  return prediction.expiresAt > Date.now();
}

