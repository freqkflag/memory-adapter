import { readFile } from "fs/promises";
import path from "path";

async function readMarkdown(relative: string): Promise<string> {
  const absolute = path.resolve(relative);
  return readFile(absolute, "utf8");
}

export async function getResourceIdentity(): Promise<string> {
  return readMarkdown("memory/identity_core.md");
}

export async function getResourceTimeline(): Promise<string> {
  return readMarkdown("memory/life_timeline.md");
}

export async function getResourceCurrentState(): Promise<string> {
  return readMarkdown("memory/current_state.md");
}

export async function getResourceCreativeLab(): Promise<string> {
  return readMarkdown("memory/creative_lab.md");
}

export async function getResourceProjects(): Promise<string> {
  return readMarkdown("memory/project_tracker.md");
}

export async function getResourceReflections(): Promise<string> {
  return readMarkdown("memory/reflections.md");
}

export async function getResourcePredictions(): Promise<string> {
  return readMarkdown("memory/predictions.md");
}

export async function getResourceEmotionalState(): Promise<string> {
  return readMarkdown("memory/emotional_vectors.md");
}

export async function getResourceAgents(): Promise<string> {
  return "Agents are stored in runtime registry; no static markdown representation.";
}

