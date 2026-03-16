import { MemoryGraph } from "./memoryGraph";

export function traverseGraph(
  graph: MemoryGraph,
  startIds: string[],
  maxDepth: number
): string[] {
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [];

  for (const id of startIds) {
    queue.push({ id, depth: 0 });
    visited.add(id);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    if (current.depth >= maxDepth) continue;
    for (const edge of graph.getEdges(current.id)) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push({ id: edge.to, depth: current.depth + 1 });
      }
    }
  }

  return Array.from(visited);
}

