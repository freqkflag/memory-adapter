import { MemoryItem } from "../memory/MemoryItem";
import { Insight } from "./reflectionEngine";
import { keywordOverlap } from "../utils/text";

export interface CounterfactualResult {
  opposingHypothesis: string;
  contradictionCount: number;
}

export function verifyInsight(
  insightText: string,
  episodes: MemoryItem[]
): Insight {
  const evidenceEpisodes: string[] = [];
  let supporting = 0;
  let contradicting = 0;

  for (const ep of episodes) {
    const overlap = keywordOverlap(insightText, ep.text);
    if (overlap > 0.3) {
      evidenceEpisodes.push(ep.id);
      supporting += 1;
    } else if (overlap > 0.1) {
      contradicting += 1;
    }
  }

  const total = supporting + contradicting || 1;
  const confidence = supporting / total;

  const opposingHypothesis = `Opposing: not(${insightText})`;

  return {
    text: insightText,
    confidence,
    evidenceEpisodes,
    contradictionCount: contradicting,
    opposingHypothesis
  };
}

