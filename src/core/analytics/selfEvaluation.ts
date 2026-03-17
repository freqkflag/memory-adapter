import type { CognitionCoordinator } from "../../cognition/cognitionCoordinator.js";
import { computeMemoryStats, type MemoryStats } from "../memory/memoryStats.js";
import { detectTemporalAnomaly, type TemporalAnomalySummary } from "../memory/temporalAnomalyDetector.js";
import { summarizeEmotionalDrift } from "../../reflection/emotionalDriftHelper.js";
import { parseELang } from "../../emotion/elangParser.js";

export interface EmotionalTrajectorySnapshot {
  summary: string;
  count: number;
}

export interface HealthSnapshot {
  memoryStats: MemoryStats;
  anomalySignals: TemporalAnomalySummary;
  emotionalTrajectory?: EmotionalTrajectorySnapshot;
}

export async function computeHealthSnapshot(coordinator: CognitionCoordinator): Promise<HealthSnapshot> {
  const memories = coordinator.getAllMemories();

  const memoryStats = computeMemoryStats(memories);
  const anomalySignals = detectTemporalAnomaly(memories);

  // Build an emotional trajectory snapshot from emotion-domain memories, if available.
  const emotionMemories = memories.filter((m) => m.domain === "emotion");
  const vectors = emotionMemories
    .map((m) => {
      try {
        return parseELang(m.text);
      } catch {
        return undefined;
      }
    })
    .filter((v): v is ReturnType<typeof parseELang> => v !== undefined);

  let emotionalTrajectory: EmotionalTrajectorySnapshot | undefined;
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

