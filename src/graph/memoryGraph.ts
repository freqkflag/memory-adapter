import { MemoryItem } from "../memory/MemoryItem";

export type EdgeType = "related_to" | "part_of" | "inspired_by" | "same_project" | "same_topic";

export interface MemoryEdge {
  from: string;
  to: string;
  type: EdgeType;
  weight: number;
}

export class MemoryGraph {
  private adjacency: Map<string, MemoryEdge[]> = new Map();

  addEdge(edge: MemoryEdge): void {
    if (!this.adjacency.has(edge.from)) {
      this.adjacency.set(edge.from, []);
    }
    this.adjacency.get(edge.from)!.push(edge);
  }

  getNeighbors(id: string): MemoryEdge[] {
    return this.adjacency.get(id) ?? [];
  }

  static buildFromMemories(items: MemoryItem[]): MemoryGraph {
    const graph = new MemoryGraph();
    for (const a of items) {
      for (const b of items) {
        if (a.id === b.id) continue;
        if (a.domain === b.domain) {
          graph.addEdge({ from: a.id, to: b.id, type: "related_to", weight: 0.5 });
        }
        if (a.sectionPath.length && b.sectionPath.length && a.sectionPath[0] === b.sectionPath[0]) {
          graph.addEdge({ from: a.id, to: b.id, type: "same_topic", weight: 0.4 });
        }
      }
    }
    return graph;
  }
}

