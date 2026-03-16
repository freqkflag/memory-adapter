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

  touch(id: string, timestamp: number): void {
    const existing = this.agents.get(id);
    if (existing) {
      existing.lastSeen = timestamp;
      this.agents.set(id, existing);
    }
  }

  list(): Agent[] {
    return Array.from(this.agents.values());
  }
}

