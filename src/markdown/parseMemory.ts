import fs from "fs";
import path from "path";
import crypto from "crypto";
import { MemoryDomain, MemoryDurability, MemoryItem } from "../types";

const FILE_DOMAIN_MAP: Record<string, MemoryDomain> = {
  "joey_ai_memory_architecture.md": "architecture",
  "identity_core.md": "identity",
  "life_timeline.md": "timeline",
  "current_state.md": "current_state",
  "creative_lab.md": "creative",
  "project_tracker.md": "projects",
  "memory/reflections.md": "identity",
};

const FILE_DURABILITY_DEFAULT: Partial<Record<MemoryDomain, MemoryDurability>> = {
  identity: "stable",
  architecture: "stable",
  timeline: "historical",
  current_state: "dynamic",
  creative: "semi_stable",
  projects: "dynamic",
};

function inferDurability(
  domain: MemoryDomain,
  sectionPath: string[]
): MemoryDurability {
  const base = FILE_DURABILITY_DEFAULT[domain];
  if (base) return base;
  return "dynamic";
}

function inferTags(text: string, domain: MemoryDomain): string[] {
  const tags = new Set<string>();
  const lower = text.toLowerCase();

  if (domain === "identity") tags.add("identity");
  if (domain === "timeline") tags.add("timeline");
  if (domain === "current_state") tags.add("state");
  if (domain === "projects") tags.add("projects");
  if (domain === "creative") tags.add("creative");
  if (domain === "architecture") tags.add("meta");

  if (lower.includes("tattoo")) tags.add("tattoo");
  if (lower.includes("budget") || lower.includes("finance")) tags.add("finance");
  if (lower.includes("cosplay")) tags.add("cosplay");
  if (lower.includes("diy")) tags.add("diy");
  if (lower.includes("halloween") || lower.includes("horror")) tags.add("horror");

  return Array.from(tags);
}

function conflictGroupFor(domain: MemoryDomain, sectionPath: string[], text: string): string | undefined {
  const lower = text.toLowerCase();
  if (domain === "identity" && lower.includes("location")) {
    return "identity/location";
  }
  if (domain === "projects") {
    const inActive = sectionPath.some((h) => h.toLowerCase().includes("active projects"));
    if (inActive) return "projects/active";
  }
  return undefined;
}

function makeId(sourceFile: string, sectionPath: string[], text: string): string {
  const hash = crypto
    .createHash("sha1")
    .update(sourceFile + "::" + sectionPath.join(" > ") + "::" + text.trim())
    .digest("hex")
    .slice(0, 12);
  return hash;
}

export function parseMarkdownFile(
  baseDir: string,
  fileName: string
): MemoryItem[] {
  const fullPath = path.join(baseDir, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const lines = raw.split(/\r?\n/);

  const domain = FILE_DOMAIN_MAP[fileName];
  if (!domain) {
    return [];
  }

  const items: MemoryItem[] = [];
  const sectionPath: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      sectionPath.splice(level - 1);
      sectionPath[level - 1] = title;
      continue;
    }

    const bulletMatch = /^\s*[-*]\s+(.*)$/.exec(line);
    if (bulletMatch) {
      const text = bulletMatch[1].trim();
      if (!text) continue;

      const durability = inferDurability(domain, sectionPath);
      const tags = inferTags(text, domain);
      const conflictGroupKey = conflictGroupFor(domain, sectionPath, text);
      const id = makeId(fileName, sectionPath, text);

      const isReflection = fileName === "memory/reflections.md";
      const baseImportance = isReflection ? 3.5 : 0.5;

      const item: MemoryItem = {
        id,
        domain,
        durability,
        sectionPath: [...sectionPath],
        text,
        tags,
        sourceFile: fileName,
        line: i,
        importance: baseImportance,
        accessCount: 0,
        strength: 0,
        version: 1,
        conflictGroupKey,
      };

      items.push(item);
    }
  }

  return items;
}

export function parseAllMarkdown(baseDir: string): MemoryItem[] {
  const files = Object.keys(FILE_DOMAIN_MAP);
  return files.flatMap((name) => parseMarkdownFile(baseDir, name));
}

