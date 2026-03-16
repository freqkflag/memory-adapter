export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter(Boolean);
}

export function keywordOverlap(queryTokens: string[], docTokens: string[]): number {
  const docSet = new Set(docTokens);
  let overlap = 0;
  for (const token of queryTokens) {
    if (docSet.has(token)) overlap += 1;
  }
  return overlap;
}

