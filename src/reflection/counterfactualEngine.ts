import { MemoryItem } from "../memory/MemoryItem";
import { Insight } from "./reflectionEngine";
import { keywordOverlap } from "../utils/text";

export interface CounterfactualCheck {
  insight: Insight;
  counterfactual: string;
  adjustedConfidence: number;
}

export function generateOpposingHypothesis(insight: string): string {
  if (insight.toLowerCase().includes("prefers")) {
    return insight.replace(/prefers/gi, "does not consistently prefer");
  }
  return `Opposite of: ${insight}`;
}

export function evaluateCounterfactual(
  insight: Insight,
  episodes: MemoryItem[]
): CounterfactualCheck {
  const counterfactual = generateOpposingHypothesis(insight.text);
  let counterEvidence = 0;
  for (const ep of episodes) {
    const overlap = keywordOverlap(counterfactual, ep.text);
    if (overlap > 0.2) counterEvidence += 1;
  }
  const penalty = Math.min(0.5, counterEvidence * 0.05);
  const adjustedConfidence = Math.max(0, insight.confidence - penalty);
  return {
    insight,
    counterfactual,
    adjustedConfidence
  };
}

import { Insight } from "../types";
import { EpisodeSummary } from "./summarizeEpisodes";
import { generateCounterfactual } from "./hypothesisGenerator";
import { evidenceSearch } from "./evidenceSearch";
import { updateConfidence } from "./confidenceUpdate";

export interface CounterfactualResult {
  updatedInsight: Insight;
  supportingEvidence: number;
  contradictingEvidence: number;
  recommendedRewrite?: string;
}

export interface CounterfactualOptions {
  confidenceThreshold?: number;
}

export function runCounterfactualTest(
  insight: Insight,
  summaries: EpisodeSummary[],
  options: CounterfactualOptions = {}
): CounterfactualResult {
  const { counterfactualText } = generateCounterfactual(insight);
  const stats = evidenceSearch(insight.text, counterfactualText, summaries);
  const updated = updateConfidence(insight, stats);

  const threshold = options.confidenceThreshold ?? 0.4;
  let recommendedRewrite: string | undefined;

  if (
    stats.supportingEvidence > 0 &&
    stats.contradictingEvidence > 0
  ) {
    recommendedRewrite =
      "User may have context-dependent preferences; for example, calm explanations when overwhelmed but more detailed or energetic explanations when exploring ideas.";
  }

  if (updated.confidence < threshold) {
    recommendedRewrite =
      recommendedRewrite ??
      "Insight rejected due to low net evidence; avoid relying on this as a stable pattern.";
  }

  return {
    updatedInsight: updated,
    supportingEvidence: stats.supportingEvidence,
    contradictingEvidence: stats.contradictingEvidence,
    recommendedRewrite,
  };
}

