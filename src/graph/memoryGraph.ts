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

