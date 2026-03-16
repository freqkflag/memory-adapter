export function appendMemoryItemsToMarkdown(existing, items, heading) {
    const lines = [];
    if (existing.trim()) {
        lines.push(existing.trimEnd(), "");
    }
    lines.push(`# ${heading}`);
    for (const item of items) {
        lines.push("", `- (${item.id}) ${item.text}`);
    }
    return lines.join("\n") + "\n";
}
