"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationAgent = void 0;
const verifyInsight_1 = require("../reflection/verifyInsight");
class VerificationAgent {
    constructor(coordinator) {
        this.coordinator = coordinator;
        this.id = "verification";
        this.name = "Verification Agent";
        this.type = "verificationAgent";
    }
    async testInsight(text) {
        const memories = this.coordinator.getAllMemories();
        const insight = (0, verifyInsight_1.verifyInsight)(text, memories);
        await this.coordinator.logOperation({
            agentId: this.id,
            action: "test_insight",
            payload: { text, confidence: insight.confidence }
        });
        return insight;
    }
}
exports.VerificationAgent = VerificationAgent;
