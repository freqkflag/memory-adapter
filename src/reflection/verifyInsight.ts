import { MemoryItem } from "../memory/MemoryItem.js";

export interface Insight {
  text: string;
  confidence: number;
  evidenceEpisodes: string[];
  contradictionCount: number;
}

export function verifyInsight(text: string, episodes: MemoryItem[]): Insight {
  const evidenceEpisodes: string[] = [];
  let contradictionCount = 0;
  for (const ep of episodes) {
    if (ep.text.toLowerCase().includes("not")) {
      contradictionCount += 1;
    } else {
      evidenceEpisodes.push(ep.id);
    }
  }
  const baseConfidence = evidenceEpisodes.length / (evidenceEpisodes.length + contradictionCount || 1);
  const confidence = Math.max(0.1, Math.min(0.99, baseConfidence));
  return {
    text,
    confidence,
    evidenceEpisodes,
    contradictionCount
  };
}

