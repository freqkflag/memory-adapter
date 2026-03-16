"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePredictions = generatePredictions;
exports.isPredictionActive = isPredictionActive;
const patternMining_1 = require("./patternMining");
const predictionScoring_1 = require("./predictionScoring");
const ids_1 = require("../utils/ids");
const time_1 = require("../utils/time");
function generatePredictions(memories) {
    const patterns = (0, patternMining_1.minePredictivePatterns)(memories);
    const predictions = [];
    const createdAt = Date.now();
    const expiresAt = (0, time_1.hoursFromNow)(72);
    for (const pattern of patterns) {
        const confidence = (0, predictionScoring_1.scorePrediction)(pattern, memories);
        const supportingMemories = memories.map((m) => m.id);
        predictions.push({
            id: (0, ids_1.generateId)("pred"),
            prediction: pattern,
            confidence,
            supportingMemories,
            createdAt,
            expiresAt
        });
    }
    return predictions;
}
function isPredictionActive(prediction) {
    if (!prediction.expiresAt)
        return true;
    return prediction.expiresAt > Date.now();
}
