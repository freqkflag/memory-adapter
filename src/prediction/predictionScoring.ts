import { Prediction } from "./predictionEngine";
import { hasExpired } from "../utils/time";

export function scorePrediction(prediction: Prediction): number {
  if (prediction.expiresAt && hasExpired(prediction.expiresAt)) {
    return 0;
  }
  return prediction.confidence;
}

