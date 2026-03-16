import { Insight } from "../types";
import { EvidenceStats } from "./evidenceSearch";

export function updateConfidence(
  insight: Insight,
  evidence: EvidenceStats
): Insight {
  const raw = evidence.supportingEvidence - evidence.contradictingEvidence;
  const normalized = Math.max(0, Math.min(1, raw / 5 + insight.confidence * 0.5));
  return {
    ...insight,
    confidence: normalized,
    lastTested: Date.now(),
  };
}

