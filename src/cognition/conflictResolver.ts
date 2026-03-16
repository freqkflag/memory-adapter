import { MemoryItem } from "../types";

export interface ResolvedConflict {
  item: MemoryItem;
  merged: boolean;
}

export function mergeDuplicates(
  existing: MemoryItem,
  incoming: MemoryItem
): MemoryItem {
  const tags = Array.from(new Set([...existing.tags, ...incoming.tags]));
  return {
    ...existing,
    tags,
  };
}

export function resolveTextEdit(
  existing: MemoryItem,
  incoming: MemoryItem
): MemoryItem {
  const existingVersion = existing.version ?? 0;
  const incomingVersion = incoming.version ?? 0;
  if (incomingVersion >= existingVersion) {
    return { ...incoming };
  }
  return existing;
}

export function resolveConflict(
  existing: MemoryItem,
  incoming: MemoryItem
): ResolvedConflict {
  if (existing.text === incoming.text) {
    const merged = mergeDuplicates(existing, incoming);
    return { item: merged, merged: true };
  }

  const mergedTags = mergeDuplicates(existing, incoming);
  const resolved = resolveTextEdit(mergedTags, incoming);
  const merged = resolved !== existing;
  return { item: resolved, merged };
}

