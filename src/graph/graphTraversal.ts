import { MemoryGraph } from "./memoryGraph";
import { MemoryItem } from "../types";

export interface ExpandedResult {
  item: MemoryItem;
  distance: number;
}

export function expandFromSeeds(
  graph: MemoryGraph,
  seedIds: string[],
  maxDepth: number
): ExpandedResult[] {
  const visited = new Set<string>();
  const results: ExpandedResult[] = [];
  const queue: { id: string; depth: number }[] = [];

  for (const id of seedIds) {
    if (!graph.nodes.has(id)) continue;
    visited.add(id);
    results.push({ item: graph.nodes.get(id)!, distance: 0 });
    queue.push({ id, depth: 0 });
  }

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (depth >= maxDepth) continue;
    const neighbors = graph.adjacency.get(id) ?? [];
    for (const edge of neighbors) {
      const nextId = edge.to;
      if (visited.has(nextId)) continue;
      const item = graph.nodes.get(nextId);
      if (!item) continue;
      visited.add(nextId);
      const nextDepth = depth + 1;
      results.push({ item, distance: nextDepth });
      queue.push({ id: nextId, depth: nextDepth });
    }
  }

  return results;
}

