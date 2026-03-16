import { Insight } from "../types";
import { EpisodeSummary } from "./summarizeEpisodes";

export interface ContradictionResult {
  contradictionCount: number;
}

export function contradictionCheck(
  insight: Insight,
  summaries: EpisodeSummary[],
  existingInsights: Insight[]
): ContradictionResult {
  const lower = insight.text.toLowerCase();
  let count = 0;

  if (lower.includes("calm")) {
    for (const s of summaries) {
      const t = s.summary.toLowerCase();
      if (t.includes("energetic") || t.includes("high energy")) {
        count++;
      }
    }
    for (const other of existingInsights) {
      if (other === insight) continue;
      const t = other.text.toLowerCase();
      if (t.includes("energetic explanations")) {
        count++;
      }
    }
  }

  return { contradictionCount: count };
}

