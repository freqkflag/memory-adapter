import fs from "fs";
import path from "path";
import { Episode, Insight } from "../types";
import { summarizeEpisodes, EpisodeSummary } from "./summarizeEpisodes";
import { patternDetection } from "./patternDetection";
import { verifyInsight } from "./verifyInsight";
import { runCounterfactualTest } from "./counterfactualEngine";
import { promoteInsights } from "./promoteInsights";

export interface ReflectionResult {
  summaries: EpisodeSummary[];
  insights: Insight[];
  promotedTexts: string[];
}

export interface ReflectionOptions {
  baseDir: string;
  reflectionThreshold?: number;
}

export function runReflection(
  episodes: Episode[],
  existingInsights: Insight[],
  options: ReflectionOptions
): ReflectionResult {
  const threshold = options.reflectionThreshold ?? 3;
  if (episodes.length < threshold) {
    return { summaries: [], insights: [], promotedTexts: [] };
  }

  const summaries = summarizeEpisodes(episodes);
  const rawInsights = patternDetection(summaries);

  const verified: Insight[] = [];
  for (const ins of rawInsights) {
    const v = verifyInsight(ins, summaries, existingInsights, {
      confidenceThreshold: 0.4,
    });
    if (v.verificationResult === "accepted") {
      const cf = runCounterfactualTest(v, summaries, {
        confidenceThreshold: 0.4,
      });
      verified.push(cf.updatedInsight);
    }
  }

  const promoted = promoteInsights(verified, { promotionThreshold: 0.6 });
  const promotedTexts = promoted.map((p) => p.text);

  if (promotedTexts.length) {
    const reflectionsPath = path.join(options.baseDir, "memory/reflections.md");
    let contents = fs.readFileSync(reflectionsPath, "utf8");
    const lines = contents.split(/\r?\n/);

    const sectionFor = (category: string): string => {
      if (category === "behavior") return "# Behavioral Patterns";
      if (category === "creative") return "# Creative Identity";
      if (category === "preference") return "# Cognitive Preferences";
      return "# Recurring Interests";
    };

    for (const ins of verified) {
      if (!promotedTexts.includes(ins.text)) continue;
      const heading = sectionFor(ins.category);
      let idx = lines.findIndex((l) => l.trim() === heading);
      if (idx === -1) {
        lines.push("");
        lines.push(heading);
        idx = lines.length - 1;
      }
      const insertAt = idx + 1;
      lines.splice(insertAt, 0, `- ${ins.text}`);
    }

    contents = lines.join("\n");
    fs.writeFileSync(reflectionsPath, contents, "utf8");
  }

  return { summaries, insights: verified, promotedTexts };
}

