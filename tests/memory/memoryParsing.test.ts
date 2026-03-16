import { describe, it, expect } from "vitest";
import { parseSections } from "../../src/markdown/sectionParser.js";
import { parseMemoryMarkdown } from "../../src/markdown/parseMemory.js";

describe("Memory Parsing", () => {
  const md = `
# Top

Some text.

## Child

More text.
`.trim();

  it("parses markdown sections and paths", () => {
    const sections = parseSections(md);
    expect(sections.length).toBe(2);
    expect(sections[0].path).toEqual(["Top"]);
    expect(sections[1].path).toEqual(["Top", "Child"]);
  });

  it("creates MemoryItems from markdown", () => {
    const parsed = parseMemoryMarkdown(md, "identity", "test");
    expect(parsed.items.length).toBe(2);
    expect(parsed.items[0].domain).toBe("identity");
  });
});

