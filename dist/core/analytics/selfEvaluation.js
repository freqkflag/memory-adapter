import { computeMemoryStats } from "../memory/memoryStats.js";
import { detectTemporalAnomaly } from "../memory/temporalAnomalyDetector.js";
import { summarizeEmotionalDrift } from "../../reflection/emotionalDriftHelper.js";
import { parseELang } from "../../emotion/elangParser.js";
export async function computeHealthSnapshot(coordinator) {
    const memories = coordinator.getAllMemories();
    const memoryStats = computeMemoryStats(memories);
    const anomalySignals = detectTemporalAnomaly(memories);
    // Build an emotional trajectory snapshot from emotion-domain memories, if available.
    const emotionMemories = memories.filter((m) => m.domain === "emotion");
    const vectors = emotionMemories
        .map((m) => {
        try {
            return parseELang(m.text);
        }
        catch {
            return undefined;
        }
    })
        .filter((v) => v !== undefined);
    let emotionalTrajectory;
    if (vectors.length > 0) {
        const { summary, drift } = await summarizeEmotionalDrift(vectors, Math.min(20, vectors.length));
        emotionalTrajectory = {
            summary,
            count: drift.count
        };
    }
    return {
        memoryStats,
        anomalySignals,
        emotionalTrajectory
    };
}
