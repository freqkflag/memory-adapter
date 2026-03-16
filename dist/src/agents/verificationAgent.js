import { verifyInsight } from "../reflection/verifyInsight.js";
export class VerificationAgent {
    coordinator;
    id = "verification";
    name = "Verification Agent";
    type = "verificationAgent";
    constructor(coordinator) {
        this.coordinator = coordinator;
    }
    async testInsight(text) {
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
