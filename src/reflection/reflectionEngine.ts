import { MemoryItem } from "../memory/MemoryItem.js";
import { detectSimplePatterns } from "./patternDetection.js";
import { verifyInsight, Insight } from "./verifyInsight.js";
import { generateCounterfactual } from "./counterfactualEngine.js";

export interface ReflectionResult {
  insights: Insight[];
  counterfactuals: Insight[];
}

export function generateReflections(episodes: MemoryItem[]): ReflectionResult {
  const nonReflectionEpisodes = episodes.filter((e) => e.domain !== "reflection");
  const patterns = detectSimplePatterns(nonReflectionEpisodes);
  const insights: Insight[] = [];
  const counterfactuals: Insight[] = [];

  for (const pattern of patterns) {
    const insight = verifyInsight(pattern, nonReflectionEpisodes);
    const cf = generateCounterfactual(insight);
    insights.push(insight);
    counterfactuals.push(cf);
  }

  return { insights, counterfactuals };
}

