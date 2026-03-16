import { generatePredictions } from "../prediction/predictionEngine.js";
export class PredictionAgent {
    coordinator;
    id = "prediction";
    name = "Prediction Agent";
    type = "predictionAgent";
    constructor(coordinator) {
        this.coordinator = coordinator;
    }
    async predict() {
        const memories = this.coordinator.getAllMemories();
        const predictions = generatePredictions(memories);
        await this.coordinator.logOperation({
            agentId: this.id,
            action: "predict",
            payload: { predictionCount: predictions.length }
        });
        return predictions;
    }
}
