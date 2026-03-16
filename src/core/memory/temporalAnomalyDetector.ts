import type { MemoryItem } from "../../memory/MemoryItem.js";
import type { MemoryDomain } from "../../memory/domains.js";

export interface TemporalAnomalySignal {
  type: "inactivity" | "spike";
  domain: string;
  message: string;
}

export interface TemporalAnomalySummary {
  signals: TemporalAnomalySignal[];
  recentWindowMs: number;
  baselineWindowMs: number;
}

/**
 * Simple temporal anomaly detector that looks for:
 * - Domains that were previously active but have gone silent recently.
 * - Domains with a spike of recent activity compared to a baseline window.
 */
export function detectTemporalAnomaly(
  memories: MemoryItem[],
  now: number = Date.now()
): TemporalAnomalySummary {
  const recentWindowMs = 7 * 24 * 60 * 60 * 1000; // 7 days
  const baselineWindowMs = 30 * 24 * 60 * 60 * 1000; // 30 days

  const recentThreshold = now - recentWindowMs;
  const baselineThreshold = now - baselineWindowMs;

  const baselineCounts = new Map<string, number>();
  const recentCounts = new Map<string, number>();

  for (const m of memories) {
    if (m.timestamp < baselineThreshold) continue;
    const domain = (m.domain as MemoryDomain) ?? "unknown";
    baselineCounts.set(domain, (baselineCounts.get(domain) ?? 0) + 1);
    if (m.timestamp >= recentThreshold) {
      recentCounts.set(domain, (recentCounts.get(domain) ?? 0) + 1);
    }
  }

  const signals: TemporalAnomalySignal[] = [];

  for (const [domain, baseline] of baselineCounts.entries()) {
    const recent = recentCounts.get(domain) ?? 0;

    if (baseline > 0 && recent === 0) {
      signals.push({
        type: "inactivity",
        domain,
        message: `Domain '${domain}' was active in the last ${baselineWindowMs / (24 * 60 * 60 * 1000)} days but has no activity in the last ${recentWindowMs / (24 * 60 * 60 * 1000)} days.`
      });
      continue;
    }

    const baselinePerRecentWindow = baseline > recent ? baseline / (baselineWindowMs / recentWindowMs) : baseline;
    if (recent >= baselinePerRecentWindow * 2 && recent >= 3) {
      signals.push({
        type: "spike",
        domain,
        message: `Domain '${domain}' shows a spike in recent activity (${recent}) compared to its baseline (${baseline}).`
      });
    }
  }

  return {
    signals,
    recentWindowMs,
    baselineWindowMs
  };
}

