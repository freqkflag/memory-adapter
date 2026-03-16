import { Insight } from "../types";

export interface ReflectionReviewConfig {
  archiveThreshold: number;
}

export interface ReflectionReviewResult {
  updated: Insight[];
  archived: Insight[];
}

export function reflectionReview(
  insights: Insight[],
  config: ReflectionReviewConfig
): ReflectionReviewResult {
  const now = Date.now();
  const updated: Insight[] = [];
  const archived: Insight[] = [];

  for (const ins of insights) {
    const refreshed: Insight = {
      ...ins,
      lastValidated: now,
    };
    if (refreshed.confidence < config.archiveThreshold) {
      archived.push(refreshed);
    } else {
      updated.push(refreshed);
    }
  }

  return { updated, archived };
}

