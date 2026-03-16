import { describe, it, expect } from "vitest";
import { parseSections } from "../../../src/markdown/sectionParser";
import { parseMemoryFile } from "../../../src/markdown/parseMemory";

describe("Memory parsing", () => {
  it("parses markdown headings into sections", () => {
    const md = "# Title\n\n## Sub\n\nLine one\nLine two\n";
    const sections = parseSections(md);
    expect(sections.length).toBe(2);
    expect(sections[1].title).toBe("Sub");
    expect(sections[1].path).toEqual(["Title", "Sub"]);
  });

  it("parses memory items from markdown file", async () => {
    const items = await parseMemoryFile("memory/identity_core.md", "identity", "test");
    expect(Array.isArray(items)).toBe(true);
  });
}

