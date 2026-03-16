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

