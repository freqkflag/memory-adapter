import { describe, it, expect } from "vitest";
import { parseELang } from "../../src/emotion/elangParser";
import { loadAxisRegistry } from "../../src/emotion/axisRegistry";

describe("E-Lang emotional vectors", () => {
  it("parses syntax into numeric vectors and trajectory", () => {
    const expr = "valence:0.5, arousal:0.2 -> valence:0.6, arousal:0.3";
    const v = parseELang(expr);
    expect(v.source).toBe("user");
    expect(v.axes.valence).toBeCloseTo(0.5);
    expect(v.trajectory).toBeDefined();
    expect(v.trajectory!.length).toBe(1);
  });

  it("uses axis registry and rejects unknown axes", () => {
    const axes = loadAxisRegistry();
    expect(Object.keys(axes).length).toBeGreaterThan(0);
    expect(() => parseELang("unknownAxis:1.0")).toThrow();
  });
});

