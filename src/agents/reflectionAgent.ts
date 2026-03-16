import { CognitionCoordinator } from "../cognition/cognitionCoordinator";
import { AgentRole } from "../planning/agentRoles";
import { generateReflections } from "../reflection/reflectionEngine";

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

