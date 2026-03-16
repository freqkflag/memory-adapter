import { MemoryGraph } from "./memoryGraph";

export interface TraversalResult {
  nodeId: string;
  depth: number;
}

export function traverseGraph(
  graph: MemoryGraph,
  startIds: string[],
  maxDepth: number
): TraversalResult[] {
  const results: TraversalResult[] = [];
  const queue: { id: string; depth: number }[] = [];
  const visited = new Set<string>();

  for (const id of startIds) {
    queue.push({ id, depth: 0 });
    visited.add(id);
  }

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    results.push({ nodeId: id, depth });
    if (depth >= maxDepth) continue;
    for (const edge of graph.getNeighbors(id)) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push({ id: edge.to, depth: depth + 1 });
      }
    }
  }

  return results;
}

