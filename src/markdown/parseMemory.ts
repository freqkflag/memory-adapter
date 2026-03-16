import { MarkdownSection, parseSections } from "./sectionParser";
import { MemoryItem } from "../memory/MemoryItem";
import { generateId } from "../utils/ids";
import { now } from "../utils/time";

export interface ParsedMemoryFile {
  sections: MarkdownSection[];
  items: MemoryItem[];
}

export function parseMemoryMarkdown(
  markdown: string,
  domain: string,
  createdBy: string
): ParsedMemoryFile {
  const sections = parseSections(markdown);
  const items: MemoryItem[] = [];
  const timestamp = now();

  for (const section of sections) {
    const text = section.content.join("\n").trim();
    if (!text) continue;

    const item: MemoryItem = {
      id: generateId("mem"),
      text,
      domain,
      durability: "normal",
      sectionPath: section.path,
      tags: [],
      strength: 0.5,
      importance: 0.5,
      accessCount: 0,
      createdBy,
      updatedBy: createdBy,
      version: 1,
      timestamp
    };
    items.push(item);
  }

  return { sections, items };
}

