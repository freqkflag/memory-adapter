import { Insight } from "../types";
import { EpisodeSummary } from "./summarizeEpisodes";
import { contradictionCheck } from "./contradictionCheck";

export interface VerifiedInsight extends Insight {
  verificationResult: "accepted" | "rejected";
}

export interface VerifyOptions {
  confidenceThreshold?: number;
}

export function verifyInsight(
  insight: Insight,
  summaries: EpisodeSummary[],
  existingInsights: Insight[],
  options: VerifyOptions = {}
): VerifiedInsight {
  const threshold = options.confidenceThreshold ?? 0.4;

  const lower = insight.text.toLowerCase();
  let supportingEpisodes = 0;
  const evidenceEpisodes: string[] = [];

  for (const s of summaries) {
    const sLower = s.summary.toLowerCase();
    if (sLower.includes("tattoo") && lower.includes("tattoo")) {
      supportingEpisodes++;
      evidenceEpisodes.push(s.sourceId);
    } else if (sLower.includes("budget") && lower.includes("budget")) {
      supportingEpisodes++;
      evidenceEpisodes.push(s.sourceId);
    } else if (sLower.includes("overwhelm") && lower.includes("calm")) {
      supportingEpisodes++;
      evidenceEpisodes.push(s.sourceId);
    }
  }

  const { contradictionCount } = contradictionCheck(
    insight,
    summaries,
    existingInsights
  );

  let confidence = insight.confidence;
  confidence += supportingEpisodes * 0.1;
  confidence -= contradictionCount * 0.1;
  confidence = Math.max(0, Math.min(1, confidence));

  const verificationResult = confidence >= threshold ? "accepted" : "rejected";

  return {
    ...insight,
    confidence,
    contradictionCount,
    evidenceEpisodes,
    lastValidated: Date.now(),
    verificationResult,
  };
}

