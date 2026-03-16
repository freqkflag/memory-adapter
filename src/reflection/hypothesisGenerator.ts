import { Insight } from "../types";

export interface HypothesisPair {
  original: Insight;
  counterfactualText: string;
}

export function generateCounterfactual(insight: Insight): HypothesisPair {
  const lower = insight.text.toLowerCase();

  if (lower.includes("calm") && lower.includes("explanations")) {
    return {
      original: insight,
      counterfactualText: "User prefers energetic, high-intensity explanations.",
    };
  }

  if (lower.includes("tattoo")) {
    return {
      original: insight,
      counterfactualText:
        "User's creative identity is weakly connected to tattooing and instead centers on non-ink crafts.",
    };
  }

  return {
    original: insight,
    counterfactualText: `The opposite of this statement is true: not (${insight.text})`,
  };
}

