import { CognitionCoordinator } from "../cognition/cognitionCoordinator";
import { AgentRole } from "../planning/agentRoles";
import { generatePredictions } from "../prediction/predictionEngine";

export class PredictionAgent {
  readonly id = "prediction";
  readonly name = "Prediction Agent";
  readonly type: AgentRole = "predictionAgent";

  constructor(private coordinator: CognitionCoordinator) {}

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

