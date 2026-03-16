import { MemoryItem } from "../memory/MemoryItem";
import { generatePredictions, Prediction } from "../prediction/predictionEngine";

export class PredictionAgent {
  readonly id = "predictionAgent";
  readonly name = "Prediction Agent";
  readonly type = "predictionAgent";

  predict(memories: MemoryItem[]): Prediction[] {
    return generatePredictions(memories);
  }
}

