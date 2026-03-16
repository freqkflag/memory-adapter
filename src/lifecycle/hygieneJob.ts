import fs from "fs";
import path from "path";
import { MemoryItem, MemoryDomain } from "../types";
import { runDecayEngine } from "./decayEngine";
import {
  DEFAULT_LIFECYCLE_CONFIG,
  findArchiveCandidates,
  findPromotionCandidates,
  LifecycleConfig,
} from "./memoryLifecycle";

export interface HygieneReport {
  archived: MemoryItem[];
  promoted: {
    id: string;
    from: string;
    to: string;
  }[];
  lowStrength: MemoryItem[];
  duplicatesMerged: MemoryItem[];
}

export interface HygieneJobOptions {
  baseDir: string;
  items: MemoryItem[];
  config?: LifecycleConfig;
  dryRun?: boolean;
}

function domainToFile(domain: MemoryDomain): string {
  switch (domain) {
    case "identity":
      return "identity_core.md";
    case "timeline":
      return "life_timeline.md";
    case "current_state":
      return "current_state.md";
    case "creative":
      return "creative_lab.md";
    case "projects":
      return "project_tracker.md";
    case "architecture":
    default:
      return "joey_ai_memory_architecture.md";
  }
}

function ensureArchiveSection(contents: string): { updated: string; index: number } {
  const marker = "## Archive";
  const lines = contents.split(/\r?\n/);
  let idx = lines.findIndex((l) => l.trim() === marker);
  if (idx === -1) {
    lines.push("");
    lines.push(marker);
    idx = lines.length - 1;
  }
  return { updated: lines.join("\n"), index: idx };
}

function removeBulletLine(contents: string, text: string): string {
  const lines = contents.split(/\r?\n/);
  const target = `- ${text}`;
  const idx = lines.findIndex((l) => l.trim() === target.trim());
  if (idx === -1) return contents;
  lines.splice(idx, 1);
  return lines.join("\n");
}

export function runMemoryHygieneJob(options: HygieneJobOptions): HygieneReport {
  const config = options.config ?? DEFAULT_LIFECYCLE_CONFIG;
  const report: HygieneReport = {
    archived: [],
    promoted: [],
    lowStrength: [],
    duplicatesMerged: [],
  };

  const { items: withStrength, decayCandidates } = runDecayEngine(
    options.items,
    {
      strengthThreshold: config.decayStrengthThreshold,
    }
  );

  report.lowStrength = decayCandidates;

  const archiveDecisions = findArchiveCandidates(withStrength, config);
  const promotionDecisions = findPromotionCandidates(withStrength, config);

  if (!options.dryRun) {
    const byFile = new Map<string, string>();

    const getFile = (fileName: string): string => {
      if (!byFile.has(fileName)) {
        const fullPath = path.join(options.baseDir, fileName);
        const content = fs.readFileSync(fullPath, "utf8");
        byFile.set(fileName, content);
      }
      return byFile.get(fileName)!;
    };

    const setFile = (fileName: string, contents: string) => {
      byFile.set(fileName, contents);
    };

    for (const decision of archiveDecisions) {
      const item = decision.item;
      const fileName = domainToFile(item.domain);
      let contents = getFile(fileName);
      contents = removeBulletLine(contents, item.text);
      const archive = ensureArchiveSection(contents);
      const lines = archive.updated.split(/\r?\n/);
      const insertAt = archive.index + 1;
      lines.splice(insertAt, 0, `- ${item.text}`);
      contents = lines.join("\n");
      setFile(fileName, contents);
      report.archived.push({ ...item, archived: true });
    }

    const seen = new Set<string>();
    for (const item of withStrength) {
      const key = `${item.domain}::${item.sectionPath.join(" > ")}::${item.text.trim().toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        continue;
      }
      const fileName = domainToFile(item.domain);
      let contents = getFile(fileName);
      const before = contents;
      contents = removeBulletLine(contents, item.text);
      if (contents !== before) {
        setFile(fileName, contents);
        report.duplicatesMerged.push(item);
      }
    }

    for (const [fileName, contents] of byFile.entries()) {
      const fullPath = path.join(options.baseDir, fileName);
      fs.writeFileSync(fullPath, contents, "utf8");
    }
  } else {
    report.archived = archiveDecisions.map((d) => d.item);
  }

  for (const decision of promotionDecisions) {
    report.promoted.push({
      id: decision.id,
      from: decision.from,
      to: decision.to,
    });
  }

  return report;
}

