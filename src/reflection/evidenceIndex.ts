import { Insight } from "../types";

export interface EvidenceIndex {
  episodeToInsights: Map<string, Insight[]>;
}

export function buildEvidenceIndex(insights: Insight[]): EvidenceIndex {
  const episodeToInsights = new Map<string, Insight[]>();

  for (const ins of insights) {
    for (const epId of ins.evidenceEpisodes) {
      if (!episodeToInsights.has(epId)) {
        episodeToInsights.set(epId, []);
      }
      episodeToInsights.get(epId)!.push(ins);
    }
  }

  return { episodeToInsights };
}

export function evidenceIndexToJSON(index: EvidenceIndex): any {
  const out: Record<string, { insights: { text: string; category: string; confidence: number }[] }> =
    {};
  for (const [epId, insights] of index.episodeToInsights.entries()) {
    out[epId] = {
      insights: insights.map((ins) => ({
        text: ins.text,
        category: ins.category,
        confidence: ins.confidence,
      })),
    };
  }
  return out;
}

