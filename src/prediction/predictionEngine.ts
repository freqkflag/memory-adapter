import { MemoryItem } from "../memory/MemoryItem";
import { minePredictivePatterns } from "./patternMining";
import { scorePrediction } from "./predictionScoring";
import { generateId } from "../utils/ids";
import { hoursFromNow } from "../utils/time";

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

