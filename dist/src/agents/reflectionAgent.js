import { generateReflections } from "../reflection/reflectionEngine.js";
export class ReflectionAgent {
    coordinator;
    id = "reflection";
    name = "Reflection Agent";
    type = "reflectionAgent";
    constructor(coordinator) {
        this.coordinator = coordinator;
    }
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
