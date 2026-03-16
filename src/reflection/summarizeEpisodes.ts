import { Episode } from "../types";

export interface EpisodeSummary {
  summary: string;
  topics: string[];
  emotionalSignals?: string[];
  sourceId: string;
}

export function summarizeEpisodes(episodes: Episode[]): EpisodeSummary[] {
  const summaries: EpisodeSummary[] = [];

  for (const ep of episodes) {
    const text = ep.text.trim();
    if (!text) continue;
    const lower = text.toLowerCase();

    const topics = new Set<string>();
    const emotionalSignals = new Set<string>();

    if (lower.includes("tattoo")) topics.add("tattoo");
    if (lower.includes("budget") || lower.includes("money")) topics.add("finance");
    if (lower.includes("cosplay")) topics.add("cosplay");
    if (lower.includes("overwhelmed") || lower.includes("anxious")) {
      emotionalSignals.add("overwhelm");
    }
    if (lower.includes("excited") || lower.includes("energized")) {
      emotionalSignals.add("excited");
    }

    const firstSentence = text.split(/[.!?]/)[0]?.trim() || text.slice(0, 120);

    summaries.push({
      summary: firstSentence,
      topics: Array.from(topics),
      emotionalSignals: emotionalSignals.size ? Array.from(emotionalSignals) : undefined,
      sourceId: ep.id,
    });
  }

  return summaries;
}

