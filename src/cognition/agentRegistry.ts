export interface Agent {
  id: string;
  name: string;
  type: string;
  lastSeen: number;
}

export class AgentRegistry {
  private agents = new Map<string, Agent>();

  register(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  updateLastSeen(id: string, timestamp: number): void {
    const existing = this.agents.get(id);
    if (!existing) return;
    this.agents.set(id, { ...existing, lastSeen: timestamp });
  }

  list(): Agent[] {
    return Array.from(this.agents.values());
  }
}

