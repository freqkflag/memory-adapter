import { pamDataFile } from "../config/runtime.js";

export type MemoryDomain =
  | "identity"
  | "timeline"
  | "current_state"
  | "creative"
  | "projects"
  | "reflection"
  | "prediction"
  | "emotion";

export const DOMAIN_FILE_MAP: Record<MemoryDomain, string> = {
  identity: pamDataFile("identity_core.md"),
  timeline: pamDataFile("life_timeline.md"),
  current_state: pamDataFile("current_state.md"),
  creative: pamDataFile("creative_lab.md"),
  projects: pamDataFile("project_tracker.md"),
  reflection: pamDataFile("reflections.md"),
  prediction: pamDataFile("predictions.md"),
  emotion: pamDataFile("emotional_vectors.md")
};

