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

import fs from "fs";
import path from "path";

export type AgentType = "chatgpt" | "claude" | "cursor" | "other";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  lastSeen: number;
}

export class AgentRegistry {
  private baseDir: string;
  private agents: Map<string, Agent>;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.agents = new Map();
    this.load();
  }

  private get registryPath(): string {
    return path.join(this.baseDir, "memory/agents.json");
  }

  private load() {
    try {
      const raw = fs.readFileSync(this.registryPath, "utf8");
      const parsed: Agent[] = JSON.parse(raw);
      for (const a of parsed) {
        this.agents.set(a.id, a);
      }
    } catch {
      this.agents.clear();
    }
  }

  private persist() {
    const arr = Array.from(this.agents.values());
    fs.mkdirSync(path.dirname(this.registryPath), { recursive: true });
    fs.writeFileSync(this.registryPath, JSON.stringify(arr, null, 2), "utf8");
  }

  registerAgent(name: string, type: AgentType): Agent {
    const id = `agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const agent: Agent = {
      id,
      name,
      type,
      lastSeen: Date.now(),
    };
    this.agents.set(id, agent);
    this.persist();
    return agent;
  }

  touchAgent(id: string): void {
    const a = this.agents.get(id);
    if (!a) return;
    a.lastSeen = Date.now();
    this.persist();
  }

  listAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}

