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

