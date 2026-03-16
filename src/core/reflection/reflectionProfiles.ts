export type ReflectionMode = "identityConsolidation" | "problemSolving" | "timelineReview";

export interface ReflectionProfile {
  id: ReflectionMode;
  description: string;
  focusDomains: string[];
}

const PROFILES: Record<ReflectionMode, ReflectionProfile> = {
  identityConsolidation: {
    id: "identityConsolidation",
    description: "Consolidate and refine self-related beliefs, traits, and long-term identity.",
    focusDomains: ["identity", "reflection", "timeline"]
  },
  problemSolving: {
    id: "problemSolving",
    description: "Reflect to unblock current problems, decisions, or stuck tasks.",
    focusDomains: ["current_state", "projects", "timeline"]
  },
  timelineReview: {
    id: "timelineReview",
    description: "Review recent experiences on the life timeline for patterns and lessons.",
    focusDomains: ["timeline", "reflection"]
  }
};

export function getReflectionProfile(mode: ReflectionMode): ReflectionProfile {
  return PROFILES[mode];
}

