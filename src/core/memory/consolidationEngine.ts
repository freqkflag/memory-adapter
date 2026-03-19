import { promises as fs } from "node:fs";
import { MemoryService } from "../../memory/MemoryService.js";
import type { MemoryItem } from "../../memory/MemoryItem.js";
import { generateReflections } from "../../reflection/reflectionEngine.js";
import { generatePredictions } from "../../prediction/predictionEngine.js";
import { getPamDataDir, pamDataFile } from "../../config/runtime.js";

export interface Episode {
  id: string;
  timestamp: number;
  text: string;
  domain: string;
  emotionalVectorJson?: string;
}

export interface SemanticInsight {
  id: string;
  text: string;
  confidence: number;
  evidenceEpisodes: string[];
}

const EPISODES_PATH = pamDataFile("episodes.md");
const EPISODE_ARCHIVE_PATH = pamDataFile("episode_archive.md");
const PREDICTION_PATTERNS_PATH = pamDataFile("prediction_patterns.md");

export async function loadEpisodes(): Promise<Episode[]> {
  let content = "";
  try {
    content = await fs.readFile(EPISODES_PATH, "utf8");
  } catch (err: any) {
    if (err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }

  const episodes: Episode[] = [];
  const lines = content.split(/\r?\n/).map((l) => l.trim());
  for (const line of lines) {
    if (!line.startsWith("-")) continue;
    // Format: - <isoTimestamp> | <domain> | <text>
    const raw = line.slice(1).trim();
    const parts = raw.split("|").map((p) => p.trim());
    if (parts.length < 3) continue;
    const [iso, domain, ...rest] = parts;
    const text = rest.join(" | ");
    const timestamp = Date.parse(iso);
    if (!Number.isFinite(timestamp)) continue;
    const id = `${timestamp}-${episodes.length}`;
    episodes.push({
      id,
      timestamp,
      domain,
      text
    });
  }
  return episodes;
}

export async function clusterEpisodes(episodes: Episode[]): Promise<Episode[][]> {
  if (episodes.length === 0) return [];
  const sorted = [...episodes].sort((a, b) => a.timestamp - b.timestamp);
  const clusters: Episode[][] = [];
  let current: Episode[] = [];
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  for (const ep of sorted) {
    if (current.length === 0) {
      current.push(ep);
      continue;
    }
    const last = current[current.length - 1];
    if (ep.domain === last.domain && ep.timestamp - last.timestamp <= ONE_DAY_MS) {
      current.push(ep);
    } else {
      clusters.push(current);
      current = [ep];
    }
  }
  if (current.length > 0) clusters.push(current);
  return clusters;
}

export async function generateInsightCandidates(
  clusters: Episode[][],
  memoryService: MemoryService
): Promise<SemanticInsight[]> {
  const insights: SemanticInsight[] = [];

  for (const cluster of clusters) {
    const items: MemoryItem[] = cluster.map((ep) => ({
      id: ep.id,
      text: ep.text,
      domain: ep.domain,
      durability: "normal",
      sectionPath: [],
      tags: [],
      strength: 0.5,
      importance: 0.5,
      accessCount: 0,
      createdBy: "consolidation",
      updatedBy: "consolidation",
      version: 1,
      timestamp: ep.timestamp
    }));

    const { insights: reflectionInsights } = generateReflections(items);
    const predictions = generatePredictions(items);

    for (const r of reflectionInsights) {
      insights.push({
        id: `refl-${cluster[0]?.id ?? "cluster"}`,
        text: r.text,
        confidence: r.confidence,
        evidenceEpisodes: r.evidenceEpisodes.length ? r.evidenceEpisodes : cluster.map((e) => e.id)
      });
    }

    for (const p of predictions) {
      insights.push({
        id: p.id,
        text: p.prediction,
        confidence: p.confidence,
        evidenceEpisodes: cluster.map((e) => e.id)
      });
    }
  }

  return insights;
}

export async function storeSemanticInsights(insights: SemanticInsight[]): Promise<void> {
  if (insights.length === 0) return;
  await fs.mkdir(getPamDataDir(), { recursive: true });

  const lines: string[] = [];
  for (const insight of insights) {
    const line = `- ${insight.id} | confidence=${insight.confidence.toFixed(
      3
    )} | evidence=${insight.evidenceEpisodes.join(",")} | ${insight.text}`;
    lines.push(line);
  }

  await fs.appendFile(PREDICTION_PATTERNS_PATH, lines.join("\n") + "\n", "utf8");
}

export async function archiveOldEpisodes(episodes: Episode[], thresholdMs: number): Promise<void> {
  if (episodes.length === 0) return;
  const cutoff = Date.now() - thresholdMs;
  const toArchive = episodes.filter((e) => e.timestamp < cutoff);
  if (toArchive.length === 0) return;

  await fs.mkdir(getPamDataDir(), { recursive: true });

  const lines = toArchive.map(
    (e) => `- ${new Date(e.timestamp).toISOString()} | ${e.domain} | ${e.text}`
  );
  await fs.appendFile(EPISODE_ARCHIVE_PATH, lines.join("\n") + "\n", "utf8");
}

export async function runDailyConsolidation(memoryService: MemoryService): Promise<void> {
  const episodes = await loadEpisodes();
  const clusters = await clusterEpisodes(episodes);
  const insights = await generateInsightCandidates(clusters, memoryService);
  await storeSemanticInsights(insights);

  // Archive episodes older than 30 days.
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  await archiveOldEpisodes(episodes, THIRTY_DAYS_MS);
}

