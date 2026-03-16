import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { AgentRole } from "../planning/agentRoles.js";
import { generateReflections } from "../reflection/reflectionEngine.js";

export class ReflectionAgent {
  readonly id = "reflection";
  readonly name = "Reflection Agent";
  readonly type: AgentRole = "reflectionAgent";

  constructor(private coordinator: CognitionCoordinator) {}

  async reflect() {
    const memories = this.coordinator.getAllMemories();
    const { insights, counterfactuals } = generateReflections(memories);
    await this.coordinator.logOperation({
      agentId: this.id,
      action: "reflect",
      payload: { insightCount: insights.length, counterfactualCount: counterfactuals.length }
    });
    return { insights, counterfactuals };
  }
}

