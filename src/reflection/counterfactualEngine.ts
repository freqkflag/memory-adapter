import { Insight } from "./verifyInsight.js";

export interface CounterfactualPair {
  insight: Insight;
  counterfactual: Insight;
}

export function generateCounterfactual(insight: Insight): Insight {
  let text = insight.text;
  if (text.includes(" prefers ")) {
    text = text.replace(" prefers ", " prefers not ");
  } else if (text.includes("often")) {
    text = text.replace("often", "rarely");
  } else {
    text = `Opposite of: ${text}`;
  }
  return {
    text,
    confidence: Math.max(0.1, 1 - insight.confidence),
    evidenceEpisodes: [],
    contradictionCount: 0
  };
}

