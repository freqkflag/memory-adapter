import { MemoryItem } from "../memory/MemoryItem";

export function appendMemoryItemsToMarkdown(
  existing: string,
  items: MemoryItem[],
  heading: string
): string {
  const lines: string[] = [];
  if (existing.trim()) {
    lines.push(existing.trimEnd(), "");
  }
  lines.push(`# ${heading}`);

  for (const item of items) {
    lines.push("", `- (${item.id}) ${item.text}`);
  }

  return lines.join("\n") + "\n";
}

