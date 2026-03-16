import { Insight } from "../types";
import { EpisodeSummary } from "./summarizeEpisodes";

export function patternDetection(
  summaries: EpisodeSummary[]
): Insight[] {
  const textAll = summaries.map((s) => s.summary.toLowerCase()).join(" ");

  const evidenceEpisodes: string[] = summaries.map((s) => s.sourceId);
  const now = Date.now();

  const insights: Insight[] = [];

  if (/(calm|overwhelmed|too much info)/.test(textAll)) {
    insights.push({
      text: "User prefers calm, low-overwhelm explanations when processing information.",
      category: "preference",
      confidence: 0.6,
      evidenceEpisodes,
      counterEvidenceEpisodes: [],
      contradictionCount: 0,
      createdAt: now,
      lastValidated: now,
      lastTested: now,
    });
  }

  if (/(tattoo|flash|ink)/.test(textAll)) {
    insights.push({
      text: "Creative identity strongly centers around tattooing and related art.",
      category: "creative",
      confidence: 0.6,
      evidenceEpisodes,
      counterEvidenceEpisodes: [],
      contradictionCount: 0,
      createdAt: now,
      lastValidated: now,
      lastTested: now,
    });
  }

  if (/(budget|money|finance)/.test(textAll)) {
    insights.push({
      text: "Financial organization and budgeting are recurring problem areas and project themes.",
      category: "behavior",
      confidence: 0.6,
      evidenceEpisodes,
      counterEvidenceEpisodes: [],
      contradictionCount: 0,
      createdAt: now,
      lastValidated: now,
      lastTested: now,
    });
  }

  return insights;
}

