import { MemoryItem } from "../memory/MemoryItem";

export type ConflictResolution =
  | { type: "merged"; item: MemoryItem }
  | { type: "flagged"; items: MemoryItem[] };

export function resolveDuplicateWrites(a: MemoryItem, b: MemoryItem): ConflictResolution {
  const merged: MemoryItem = {
    ...a,
    text: a.text === b.text ? a.text : `${a.text}\n\n---\n\n${b.text}`,
    tags: Array.from(new Set([...a.tags, ...b.tags])),
    version: Math.max(a.version, b.version) + 1
  };
  return { type: "merged", item: merged };
}

export function resolveTagUpdate(a: MemoryItem, b: MemoryItem): MemoryItem {
  return {
    ...a,
    tags: Array.from(new Set([...a.tags, ...b.tags])),
    version: Math.max(a.version, b.version) + 1
  };
}

export function resolveTextEdit(a: MemoryItem, b: MemoryItem): ConflictResolution {
  if (a.version === b.version) {
    return { type: "merged", item: a };
  }
  const newer = a.version > b.version ? a : b;
  return { type: "merged", item: newer };
}

export function hardConflict(a: MemoryItem, b: MemoryItem): ConflictResolution {
  return { type: "flagged", items: [a, b] };
}

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

