"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionAgent = void 0;
const predictionEngine_1 = require("../prediction/predictionEngine");
class PredictionAgent {
    constructor(coordinator) {
        this.coordinator = coordinator;
        this.id = "prediction";
        this.name = "Prediction Agent";
        this.type = "predictionAgent";
    }
    async predict() {
        const memories = this.coordinator.getAllMemories();
        const predictions = (0, predictionEngine_1.generatePredictions)(memories);
        await this.coordinator.logOperation({
            agentId: this.id,
            action: "predict",
            payload: { predictionCount: predictions.length }
        });
        return predictions;
    }
}
exports.PredictionAgent = PredictionAgent;
