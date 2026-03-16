export type MemoryDomain =
  | "identity"
  | "timeline"
  | "current-state"
  | "creative"
  | "projects"
  | "reflection"
  | "prediction"
  | "emotion";

export type Durability =
  | "fleeting"
  | "short-term"
  | "medium-term"
  | "long-term"
  | "core";

export const DOMAIN_FILE_MAP: Record<MemoryDomain, string> = {
  identity: "memory/identity_core.md",
  timeline: "memory/life_timeline.md",
  "current-state": "memory/current_state.md",
  creative: "memory/creative_lab.md",
  projects: "memory/project_tracker.md",
  reflection: "memory/reflections.md",
  prediction: "memory/predictions.md",
  emotion: "memory/emotional_vectors.md"
};

