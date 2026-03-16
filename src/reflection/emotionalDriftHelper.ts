import type { ELangVector } from "../emotion/elangVectorModel.js";
import { computeEmotionalDriftOverLastN, type DriftSummary } from "../core/emotion/trajectoryAnalytics.js";

export async function summarizeEmotionalDrift(
  vectors: ELangVector[],
  lastN: number
): Promise<{ summary: string; drift: DriftSummary }> {
  const drift = computeEmotionalDriftOverLastN(vectors, lastN);

  if (drift.count === 0 || drift.startTimestamp === null || drift.endTimestamp === null) {
    return {
      drift,
      summary: "No emotional trajectory data available for the requested window."
    };
  }

  const lines: string[] = [];
  lines.push(
    `Emotional drift over last ${drift.count} events (from ${new Date(
      drift.startTimestamp
    ).toISOString()} to ${new Date(drift.endTimestamp).toISOString()}):`
  );

  for (const [axis, delta] of Object.entries(drift.axisDeltas)) {
    const avg = drift.axisAverageChanges[axis] ?? 0;
    if (delta === 0 && avg === 0) {
      continue;
    }
    const direction = delta > 0 ? "increased" : "decreased";
    lines.push(
      `- Axis '${axis}' ${direction} by ${delta.toFixed(3)} overall (avg change per step: ${avg.toFixed(3)}).`
    );
  }

  if (lines.length === 1) {
    lines.push("No significant net changes detected across axes.");
  }

  return {
    drift,
    summary: lines.join("\n")
  };
}

