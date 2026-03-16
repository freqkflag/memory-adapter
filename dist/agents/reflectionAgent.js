"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionAgent = void 0;
const reflectionEngine_1 = require("../reflection/reflectionEngine");
class ReflectionAgent {
    constructor(coordinator) {
        this.coordinator = coordinator;
        this.id = "reflection";
        this.name = "Reflection Agent";
        this.type = "reflectionAgent";
    }
    async reflect() {
        const memories = this.coordinator.getAllMemories();
        const { insights, counterfactuals } = (0, reflectionEngine_1.generateReflections)(memories);
        await this.coordinator.logOperation({
            agentId: this.id,
            action: "reflect",
            payload: { insightCount: insights.length, counterfactualCount: counterfactuals.length }
        });
        return { insights, counterfactuals };
    }
}
exports.ReflectionAgent = ReflectionAgent;
