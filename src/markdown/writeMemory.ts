import { appendFile } from "fs/promises";
import path from "path";
import { MemoryItem } from "../memory/MemoryItem";

export async function appendMemoryToFile(
  filePath: string,
  item: MemoryItem
): Promise<void> {
  const absolute = path.resolve(filePath);
  const heading = `\n\n## ${item.sectionPath.join(" / ") || "Memory"}\n\n`;
  const metadataLines = [
    `- id: ${item.id}`,
    `- domain: ${item.domain}`,
    `- durability: ${item.durability}`,
    `- tags: ${item.tags.join(", ")}`,
    `- strength: ${item.strength.toFixed(3)}`,
    `- importance: ${item.importance.toFixed(3)}`,
    `- version: ${item.version}`,
    `- timestamp: ${new Date(item.timestamp).toISOString()}`
  ].join("\n");

  const block = `${heading}${metadataLines}\n\n${item.text}\n`;
  await appendFile(absolute, block, "utf8");
}

