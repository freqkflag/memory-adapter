import { EpisodeSummary } from "./summarizeEpisodes";

export interface EvidenceStats {
  supportingEvidence: number;
  contradictingEvidence: number;
  supportingEpisodes: string[];
  contradictingEpisodes: string[];
}

export function evidenceSearch(
  text: string,
  counterText: string,
  summaries: EpisodeSummary[]
): EvidenceStats {
  const t = text.toLowerCase();
  const c = counterText.toLowerCase();

  let supportingEvidence = 0;
  let contradictingEvidence = 0;
  const supportingEpisodes: string[] = [];
  const contradictingEpisodes: string[] = [];

  for (const s of summaries) {
    const sLower = s.summary.toLowerCase();
    if (sLower.includes("calm") && t.includes("calm")) {
      supportingEvidence++;
      supportingEpisodes.push(s.sourceId);
    }
    if (sLower.includes("energetic") && c.includes("energetic")) {
      contradictingEvidence++;
      contradictingEpisodes.push(s.sourceId);
    }
  }

  return {
    supportingEvidence,
    contradictingEvidence,
    supportingEpisodes,
    contradictingEpisodes,
  };
}

