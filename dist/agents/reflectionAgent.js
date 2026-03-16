import { generateReflections } from "../reflection/reflectionEngine.js";
import { summarizeEmotionalDrift } from "../reflection/emotionalDriftHelper.js";
import { parseELang } from "../emotion/elangParser.js";
import { getReflectionProfile } from "../core/reflection/reflectionProfiles.js";
export class ReflectionAgent {
    coordinator;
    id = "reflection";
    name = "Reflection Agent";
    type = "reflectionAgent";
    constructor(coordinator) {
        this.coordinator = coordinator;
    }
    async reflect(mode) {
        const memories = this.coordinator.getAllMemories();
        const profile = mode ? getReflectionProfile(mode) : undefined;
        const { insights, counterfactuals } = generateReflections(memories);
        // Derive recent emotional trajectory from emotion-domain memories, if any.
        const emotionMemories = memories.filter((m) => m.domain === "emotion");
        const vectors = emotionMemories.map((m) => {
            try {
                return parseELang(m.text);
            }
            catch {
                return undefined;
            }
        }).filter((v) => v !== undefined);
        let emotionalTrajectorySummary;
        if (vectors.length > 0) {
            const { summary } = await summarizeEmotionalDrift(vectors, Math.min(20, vectors.length));
            emotionalTrajectorySummary = summary;
        }
        await this.coordinator.logOperation({
            agentId: this.id,
            action: "reflect",
            payload: {
                insightCount: insights.length,
                counterfactualCount: counterfactuals.length,
                emotionalTrajectorySummary,
                reflectionMode: mode,
                reflectionProfile: profile
            }
        });
        return { insights, counterfactuals, emotionalTrajectorySummary, mode, profile };
    }
}
