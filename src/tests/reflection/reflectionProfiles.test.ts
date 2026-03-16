import { describe, it, expect } from "vitest";
import { getReflectionProfile, type ReflectionMode } from "../../core/reflection/reflectionProfiles.js";

describe("reflectionProfiles", () => {
  it("returns a profile for each mode", () => {
    const modes: ReflectionMode[] = ["identityConsolidation", "problemSolving", "timelineReview"];
    for (const mode of modes) {
      const profile = getReflectionProfile(mode);
      expect(profile.id).toBe(mode);
      expect(profile.description.length).toBeGreaterThan(0);
      expect(profile.focusDomains.length).toBeGreaterThan(0);
    }
  });
});

