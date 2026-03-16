import { MemoryItem } from "../memory/MemoryItem";

export interface ConflictResolutionResult {
  item: MemoryItem;
  conflict: boolean;
  notes?: string;
}

export function resolveDuplicateWrites(existing: MemoryItem, incoming: MemoryItem): ConflictResolutionResult {
  const mergedTags = Array.from(new Set([...existing.tags, ...incoming.tags]));
  const updated: MemoryItem = {
    ...existing,
    text: existing.text === incoming.text ? existing.text : incoming.text,
    tags: mergedTags,
    version: Math.max(existing.version, incoming.version) + 1
  };

  const conflict = existing.text !== incoming.text;
  return {
    item: updated,
    conflict,
    notes: conflict ? "Text conflict detected; using latest version and incrementing version counter." : undefined
  };
}

export function mergeTags(existing: string[], updates: string[]): string[] {
  return Array.from(new Set([...existing, ...updates]));
}

