import { MemoryItem } from "./MemoryItem";
import { DOMAIN_FILE_MAP, MemoryDomain } from "./domains";
import { parseMemoryFile } from "../markdown/parseMemory";
import { appendMemoryToFile } from "../markdown/writeMemory";
import { generateId } from "../utils/ids";
import { now } from "../utils/time";

export class MemoryService {
  private cache: Map<string, MemoryItem> = new Map();

  async loadDomain(domain: MemoryDomain, agentId: string): Promise<MemoryItem[]> {
    const file = DOMAIN_FILE_MAP[domain];
    const items = await parseMemoryFile(file, domain, agentId);
    for (const item of items) {
      this.cache.set(item.id, item);
    }
    return items;
  }

  getAll(): MemoryItem[] {
    return Array.from(this.cache.values());
  }

  getById(id: string): MemoryItem | undefined {
    return this.cache.get(id);
  }

  async addMemory(
    domain: MemoryDomain,
    text: string,
    sectionPath: string[],
    tags: string[],
    createdBy: string,
    durability: string = "medium-term"
  ): Promise<MemoryItem> {
    const item: MemoryItem = {
      id: generateId("mem"),
      text,
      domain,
      durability,
      sectionPath,
      tags,
      strength: 0.5,
      importance: 0.5,
      accessCount: 0,
      createdBy,
      updatedBy: createdBy,
      version: 1,
      timestamp: now()
    };
    const file = DOMAIN_FILE_MAP[domain];
    await appendMemoryToFile(file, item);
    this.cache.set(item.id, item);
    return item;
  }
}

import path from "path";
import {
  MemoryItem,
  MemoryDomain,
  ToolResult,
  IntentAnalysis,
  Episode,
} from "../types";
import fs from "fs";
import { parseAllMarkdown } from "../markdown/parseMemory";
import { analyzeIntent } from "../reasoning/analyzeIntent";
import { vectorSearch } from "../search/vectorSearch";
import { buildInvertedIndex, keywordSearch } from "../search/keywordSearch";
import { buildMemoryGraph } from "../graph/memoryGraph";
import { expandFromSeeds } from "../graph/graphTraversal";
import { rerankResults, ScoredItem } from "../ranking/rerankResults";
import { buildContext } from "../context/buildContext";
import { runMemoryHygieneJob, HygieneReport } from "../lifecycle/hygieneJob";
import { runDecayEngine } from "../lifecycle/decayEngine";
import { runReflection } from "../reflection/reflectionEngine";

export interface RelevantContextParams {
  query: string;
  domains?: MemoryDomain[];
  limit?: number;
}

export type StoreMode = "none" | "durable" | "dynamic";

export interface IngestMemoryParams {
  content: string;
  domainHint?: MemoryDomain;
  durabilityHint?: string;
  timeContext?: string;
  store?: StoreMode;
  dryRun?: boolean;
}

export interface UpdateMemoryParams {
  targetDescription: string;
  newContent: string;
  domainHint?: MemoryDomain;
  store?: StoreMode;
  dryRun?: boolean;
}

export class MemoryService {
  private baseDir: string;
  private accessCounts: Map<string, number>;
  private lastAccessed: Map<string, number>;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.accessCounts = new Map();
    this.lastAccessed = new Map();
  }

  private loadAll(): MemoryItem[] {
    const parsed = parseAllMarkdown(this.baseDir);
    const withLifecycle: MemoryItem[] = parsed.map((item) => {
      const accessCount = this.accessCounts.get(item.id) ?? 0;
      const lastAccessed = this.lastAccessed.get(item.id);
      return {
        ...item,
        importance: item.importance ?? 0.5,
        accessCount,
        lastAccessed,
      };
    });
    const { items } = runDecayEngine(withLifecycle, {});
    return items;
  }

  private classifyDomain(text: string, hint?: MemoryDomain): MemoryDomain {
    if (hint) return hint;
    const lower = text.toLowerCase();
    if (
      lower.includes("name:") ||
      lower.includes("location:") ||
      lower.includes("neurotype")
    ) {
      return "identity";
    }
    if (lower.includes("timeline") || lower.includes("phase")) {
      return "timeline";
    }
    if (
      lower.includes("current project") ||
      lower.includes("support need") ||
      lower.includes("immediate goal")
    ) {
      return "current_state";
    }
    if (
      lower.includes("budget") ||
      lower.includes("project") ||
      lower.includes("status:")
    ) {
      return "projects";
    }
    if (
      lower.includes("cosplay") ||
      lower.includes("tattoo") ||
      lower.includes("halloween") ||
      lower.includes("idea")
    ) {
      return "creative";
    }
    if (lower.includes("memory") || lower.includes("ai roles")) {
      return "architecture";
    }
    return "current_state";
  }

  private domainToFile(domain: MemoryDomain): string {
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

  getUserSummary(focus?: string): ToolResult<string> {
    const items = this.loadAll();
    const identity = items.filter((i) => i.domain === "identity");
    const state = items.filter((i) => i.domain === "current_state");
    const projects = items.filter((i) => i.domain === "projects");

    const lines: string[] = [];
    lines.push("## Identity");
    identity.slice(0, 10).forEach((i) => lines.push(`- ${i.text}`));

    lines.push("");
    lines.push("## Current State");
    state.slice(0, 10).forEach((i) => lines.push(`- ${i.text}`));

    lines.push("");
    lines.push("## Projects");
    projects.slice(0, 10).forEach((i) => lines.push(`- ${i.text}`));

    if (focus) {
      lines.push("");
      lines.push(`_Focus: ${focus}_`);
    }

    return { ok: true, data: lines.join("\n") };
  }

  ingestMemory(params: IngestMemoryParams): ToolResult<any> {
    const store: StoreMode = params.store ?? "none";
    const content = params.content.trim();
    if (!content) {
      return { ok: false, error: "Content is required" };
    }

    const domain = this.classifyDomain(content, params.domainHint);
    const all = this.loadAll();

    const normalized = content.toLowerCase();
    const duplicate = all.find(
      (i) => i.text.toLowerCase() === normalized && i.domain === domain
    );
    if (duplicate) {
      return {
        ok: true,
        data: {
          action: "duplicate",
          existing: duplicate,
        },
      };
    }

    const lower = content.toLowerCase();
    let conflictGroupKey: string | undefined;
    if (domain === "identity" && lower.includes("location")) {
      conflictGroupKey = "identity/location";
    }
    if (conflictGroupKey) {
      const conflicts = all.filter(
        (i) => i.conflictGroupKey === conflictGroupKey
      );
      if (conflicts.length > 0) {
        return {
          ok: true,
          data: {
            action: "conflict",
            conflictGroupKey,
            conflicts,
            proposed: { domain, content },
          },
        };
      }
    }

    const targetFile = this.domainToFile(domain);
    const fullPath = path.join(this.baseDir, targetFile);
    const snippet = `- ${content}`;

    if (store === "none" || params.dryRun) {
      return {
        ok: true,
        data: {
          action: params.dryRun ? "dry-run" : "no-store",
          domain,
          targetFile,
          snippet,
        },
      };
    }

    const current = fs.readFileSync(fullPath, "utf8");
    let updated: string;
    const marker = "## Ingested Memory";
    if (current.includes(marker)) {
      const lines = current.split(/\r?\n/);
      const idx = lines.findIndex((l) => l.trim() === marker);
      const insertAt = idx + 1;
      lines.splice(insertAt, 0, snippet);
      updated = lines.join("\n");
    } else {
      updated = `${current.trimEnd()}\n\n${marker}\n${snippet}\n`;
    }

    fs.writeFileSync(fullPath, updated, "utf8");

    return {
      ok: true,
      data: {
        action: "stored",
        domain,
        targetFile,
        snippet,
      },
    };
  }

  updateMemory(params: UpdateMemoryParams): ToolResult<any> {
    const store: StoreMode = params.store ?? "durable";
    const desc = params.targetDescription.toLowerCase();
    if (!params.newContent.trim()) {
      return { ok: false, error: "newContent is required" };
    }

    const all = this.loadAll();
    let candidates = all.filter((i) => i.text.toLowerCase().includes(desc));
    if (params.domainHint) {
      candidates = candidates.filter((i) => i.domain === params.domainHint);
    }
    if (candidates.length === 0) {
      return { ok: false, error: "No matching memory found to update" };
    }
    const target = candidates[0];

    const targetFile = this.domainToFile(target.domain);
    const fullPath = path.join(this.baseDir, targetFile);

    if (store === "none" || params.dryRun) {
      return {
        ok: true,
        data: {
          action: params.dryRun ? "dry-run" : "no-store",
          target,
          newContent: params.newContent,
        },
      };
    }

    const current = fs.readFileSync(fullPath, "utf8");
    const lines = current.split(/\r?\n/);
    const lineIndex = target.line;
    if (lineIndex === undefined || !lines[lineIndex]) {
      return { ok: false, error: "Cannot safely locate target line for update" };
    }
    const originalLine = lines[lineIndex];
    const bulletMatch = /^(\s*[-*]\s+)(.*)$/.exec(originalLine);
    if (!bulletMatch) {
      return { ok: false, error: "Target line is not a bullet; refusing to edit" };
    }
    const prefix = bulletMatch[1];
    lines[lineIndex] = `${prefix}${params.newContent.trim()}`;
    fs.writeFileSync(fullPath, lines.join("\n"), "utf8");

    return {
      ok: true,
      data: {
        action: "updated",
        target,
        newContent: params.newContent.trim(),
      },
    };
  }

  detectConflicts(): ToolResult<any> {
    const all = this.loadAll();
    const groups = new Map<string, MemoryItem[]>();
    for (const item of all) {
      if (!item.conflictGroupKey) continue;
      if (!groups.has(item.conflictGroupKey)) {
        groups.set(item.conflictGroupKey, []);
      }
      groups.get(item.conflictGroupKey)!.push(item);
    }

    const conflicts: {
      group: string;
      items: MemoryItem[];
    }[] = [];

    for (const [group, items] of groups.entries()) {
      if (items.length <= 1) continue;
      const uniqueTexts = new Set(items.map((i) => i.text.trim()));
      if (uniqueTexts.size > 1) {
        conflicts.push({ group, items });
      }
    }

    return { ok: true, data: conflicts };
  }

  async getRelevantContext(
    params: RelevantContextParams
  ): Promise<ToolResult<MemoryItem[]>> {
    const { query, domains, limit = 15 } = params;
    const allItems = this.loadAll();

    const items =
      domains && domains.length
        ? allItems.filter((i) => domains.includes(i.domain))
        : allItems;

    const intent = analyzeIntent(query);

    const vectorResults = await vectorSearch(query, items, limit * 2);

    const index = buildInvertedIndex(items);
    const keywordResults = keywordSearch(query, items, index, limit * 2);

    const seedIds = new Set<string>();
    for (const r of vectorResults) seedIds.add(r.item.id);
    for (const r of keywordResults) seedIds.add(r.item.id);
    const seeds = Array.from(seedIds);

    const graph = buildMemoryGraph(items);
    const expanded = expandFromSeeds(graph, seeds, 2);

    const scored: ScoredItem[] = rerankResults(
      intent as IntentAnalysis,
      vectorResults,
      keywordResults,
      expanded
    );

    const context = buildContext(scored, limit);

    const now = Date.now();
    for (const item of context.items) {
      const prev = this.accessCounts.get(item.id) ?? 0;
      this.accessCounts.set(item.id, prev + 1);
      this.lastAccessed.set(item.id, now);
    }

    return { ok: true, data: context.items };
  }

  async explainRelevantContext(
    params: RelevantContextParams
  ): Promise<
    ToolResult<{
      intent: IntentAnalysis;
      results: {
        item: MemoryItem;
        score: number;
        breakdown: ScoredItem["breakdown"];
      }[];
    }>
  > {
    const { query, domains, limit = 15 } = params;
    const allItems = this.loadAll();
    const items =
      domains && domains.length
        ? allItems.filter((i) => domains.includes(i.domain))
        : allItems;

    const intent = analyzeIntent(query);

    const vectorResults = await vectorSearch(query, items, limit * 2);
    const index = buildInvertedIndex(items);
    const keywordResults = keywordSearch(query, items, index, limit * 2);

    const seedIds = new Set<string>();
    for (const r of vectorResults) seedIds.add(r.item.id);
    for (const r of keywordResults) seedIds.add(r.item.id);
    const seeds = Array.from(seedIds);

    const graph = buildMemoryGraph(items);
    const expanded = expandFromSeeds(graph, seeds, 2);

    const scored = rerankResults(intent, vectorResults, keywordResults, expanded);

    const now = Date.now();
    for (const s of scored.slice(0, limit)) {
      const prev = this.accessCounts.get(s.item.id) ?? 0;
      this.accessCounts.set(s.item.id, prev + 1);
      this.lastAccessed.set(s.item.id, now);
    }

    return {
      ok: true,
      data: {
        intent,
        results: scored.slice(0, limit).map((s) => ({
          item: s.item,
          score: s.score,
          breakdown: s.breakdown,
        })),
      },
    };
  }

  runHygiene(dryRun: boolean = true): ToolResult<HygieneReport> {
    const items = this.loadAll();
    const report = runMemoryHygieneJob({
      baseDir: this.baseDir,
      items,
      dryRun,
    });
    return { ok: true, data: report };
  }

  generateReflection(episodes: Episode[]): ToolResult<any> {
    const existingItems = this.loadAll();
    const existingInsights: any[] = [];

    const result = runReflection(episodes, existingInsights, {
      baseDir: this.baseDir,
    });

    return {
      ok: true,
      data: {
        summaries: result.summaries,
        insights: result.insights,
        promotedTexts: result.promotedTexts,
      },
    };
  }

  getTimeline(): ToolResult<string> {
    const filePath = path.join(this.baseDir, "life_timeline.md");
    return this.readFileAsMarkdown(filePath);
  }

  getCurrentState(): ToolResult<string> {
    const filePath = path.join(this.baseDir, "current_state.md");
    return this.readFileAsMarkdown(filePath);
  }

  getProjects(): ToolResult<string> {
    const filePath = path.join(this.baseDir, "project_tracker.md");
    return this.readFileAsMarkdown(filePath);
  }

  getCreativeLab(): ToolResult<string> {
    const filePath = path.join(this.baseDir, "creative_lab.md");
    return this.readFileAsMarkdown(filePath);
  }

  getIdentity(): ToolResult<string> {
    const filePath = path.join(this.baseDir, "identity_core.md");
    return this.readFileAsMarkdown(filePath);
  }

  getArchitecture(): ToolResult<string> {
    const filePath = path.join(this.baseDir, "joey_ai_memory_architecture.md");
    return this.readFileAsMarkdown(filePath);
  }

  private readFileAsMarkdown(filePath: string): ToolResult<string> {
    try {
      const content = require("fs").readFileSync(filePath, "utf8");
      return { ok: true, data: content };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
}

