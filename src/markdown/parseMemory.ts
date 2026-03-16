import { readFile } from "fs/promises";
import path from "path";
import { parseSections } from "./sectionParser";
import { MemoryItem } from "../memory/MemoryItem";
import { generateId } from "../utils/ids";
import { now } from "../utils/time";

export async function parseMemoryFile(
  filePath: string,
  domain: string,
  createdBy: string
): Promise<MemoryItem[]> {
  const absolute = path.resolve(filePath);
  const content = await readFile(absolute, "utf8");
  const sections = parseSections(content);

  const items: MemoryItem[] = [];
  for (const section of sections) {
    const text = section.content.join("\n").trim();
    if (!text) continue;

    const tags = Array.from(
      new Set(
        (text.match(/#([a-zA-Z0-9_-]+)/g) || []).map((t) => t.slice(1).toLowerCase())
      )
    );

    const item: MemoryItem = {
      id: generateId("mem"),
      text,
      domain,
      durability: "medium-term",
      sectionPath: section.path,
      tags,
      strength: 0.5,
      importance: 0.5,
      accessCount: 0,
      createdBy,
      updatedBy: createdBy,
      version: 1,
      timestamp: now()
    };

    items.push(item);
  }

  return items;
}

