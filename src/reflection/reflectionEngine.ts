import { MemoryItem } from "../memory/MemoryItem";
import { detectPatterns } from "./patternDetection";
import { verifyInsight } from "./verifyInsight";
import { evaluateCounterfactual } from "./counterfactualEngine";

export interface Insight {
  text: string;
  confidence: number;
  evidenceEpisodes: string[];
  contradictionCount: number;
  opposingHypothesis?: string;
}

export interface ReflectionResult {
  insights: Insight[];
}

export function isReflectionMemory(item: MemoryItem): boolean {
  return item.domain === "reflection";
}

export function generateReflections(episodes: MemoryItem[]): ReflectionResult {
  const episodeOnly = episodes.filter((e) => !isReflectionMemory(e));
  const patterns = detectPatterns(episodeOnly);

  const insights: Insight[] = [];
  for (const pattern of patterns) {
    const baseInsightText = `User shows repeated pattern: ${pattern.description}`;
    const verified = verifyInsight(baseInsightText, episodeOnly);
    const withCounterfactual = evaluateCounterfactual(verified, episodeOnly);
    insights.push({
      ...verified,
      confidence: withCounterfactual.adjustedConfidence,
      opposingHypothesis: withCounterfactual.counterfactual
    });
  }

  return { insights };
}

