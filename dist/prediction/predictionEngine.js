import { minePredictivePatterns } from "./patternMining.js";
import { scorePrediction } from "./predictionScoring.js";
import { generateId } from "../utils/ids.js";
import { hoursFromNow } from "../utils/time.js";
export function generatePredictions(memories) {
    const patterns = minePredictivePatterns(memories);
    const predictions = [];
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
export function isPredictionActive(prediction) {
    if (!prediction.expiresAt)
        return true;
    return prediction.expiresAt > Date.now();
}
