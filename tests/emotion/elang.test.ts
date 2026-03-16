import { describe, it, expect } from "vitest";
import { parseELang, ELANG_ABNF_GRAMMAR } from "../../../src/emotion/elangParser";
import { buildTrajectory } from "../../../src/emotion/trajectory";

describe("E-Lang emotional vectors", () => {
  it("exposes an ABNF grammar definition", () => {
    expect(ELANG_ABNF_GRAMMAR).toMatch(/expression = axes/);
  });

  it("parses a single vector expression", () => {
    const v = parseELang("valence=0.5,arousal=0.1");
    expect(v.axes.valence).toBeCloseTo(0.5);
    expect(v.axes.arousal).toBeCloseTo(0.1);
    expect(v.source).toBe("user");
  });

  it("parses a trajectory and builds segments", () => {
    const v = parseELang("valence=0.5 -> valence=0.1,arousal=0.9");
    expect(v.trajectory && v.trajectory.length).toBe(1);
    const segments = buildTrajectory(v);
    expect(segments.length).toBe(1);
    expect(segments[0].delta).toBeGreaterThan(0);
  });
});

