import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { AgentRole } from "../planning/agentRoles.js";
import { verifyInsight } from "../reflection/verifyInsight.js";

export class VerificationAgent {
  readonly id = "verification";
  readonly name = "Verification Agent";
  readonly type: AgentRole = "verificationAgent";

  constructor(private coordinator: CognitionCoordinator) {}

  async testInsight(text: string) {
    const memories = this.coordinator.getAllMemories();
    const insight = verifyInsight(text, memories);
    await this.coordinator.logOperation({
      agentId: this.id,
      action: "test_insight",
      payload: { text, confidence: insight.confidence }
    });
    return insight;
  }
}

