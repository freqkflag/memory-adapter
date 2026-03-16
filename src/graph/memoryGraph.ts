export type EdgeType =
  | "related_to"
  | "part_of"
  | "inspired_by"
  | "same_project"
  | "same_topic";

export interface GraphEdge {
  from: string;
  to: string;
  type: EdgeType;
}

export class MemoryGraph {
  private adjacency: Map<string, GraphEdge[]> = new Map();

  addEdge(edge: GraphEdge): void {
    const existing = this.adjacency.get(edge.from) ?? [];
    existing.push(edge);
    this.adjacency.set(edge.from, existing);
  }

  getEdges(nodeId: string): GraphEdge[] {
    return this.adjacency.get(nodeId) ?? [];
  }
}

import { MemoryItem } from "../types";

export type EdgeType =
  | "related_to"
  | "part_of"
  | "inspired_by"
  | "same_project"
  | "same_topic";

export interface GraphEdge {
  from: string;
  to: string;
  type: EdgeType;
}

export interface MemoryGraph {
  nodes: Map<string, MemoryItem>;
  edges: GraphEdge[];
  adjacency: Map<string, GraphEdge[]>;
}

export function buildMemoryGraph(items: MemoryItem[]): MemoryGraph {
  const nodes = new Map<string, MemoryItem>();
  for (const item of items) nodes.set(item.id, item);

  const edges: GraphEdge[] = [];
  const adjacency = new Map<string, GraphEdge[]>();

  const addEdge = (from: string, to: string, type: EdgeType) => {
    if (from === to) return;
    const edge: GraphEdge = { from, to, type };
    edges.push(edge);
    if (!adjacency.has(from)) adjacency.set(from, []);
    adjacency.get(from)!.push(edge);
  };

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];

      if (a.domain === b.domain && a.sectionPath.join(" > ") === b.sectionPath.join(" > ")) {
        addEdge(a.id, b.id, "part_of");
        addEdge(b.id, a.id, "part_of");
      }

      if (a.domain === "projects" && b.domain === "projects") {
        const nameOverlap =
          a.text.toLowerCase().includes("budget") &&
          b.text.toLowerCase().includes("budget");
        if (nameOverlap) {
          addEdge(a.id, b.id, "same_project");
          addEdge(b.id, a.id, "same_project");
        }
      }

      const aText = a.text.toLowerCase();
      const bText = b.text.toLowerCase();
      const topics = ["tattoo", "budget", "cosplay", "halloween", "diy", "finance"];
      const sharedTopic = topics.some(
        (t) => aText.includes(t) && bText.includes(t)
      );
      if (sharedTopic) {
        addEdge(a.id, b.id, "same_topic");
        addEdge(b.id, a.id, "same_topic");
      }

      if (a.domain !== b.domain && sharedTopic) {
        addEdge(a.id, b.id, "related_to");
        addEdge(b.id, a.id, "related_to");
      }
    }
  }

  return { nodes, edges, adjacency };
}

