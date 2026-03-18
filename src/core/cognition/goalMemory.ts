import { promises as fs } from "node:fs";

export interface Goal {
  id: string;
  goal: string;
  status: "active" | "paused" | "completed" | "failed";
  createdAt: number;
  updatedAt: number;
  iterations: number;
  lastResult?: any;

  // Optional scheduling / prioritization metadata (backward compatible).
  priorityScore?: number;
  scheduledAt?: number;
  lastEvaluated?: number;
  dueAt?: number;
  importance?: number;
  urgency?: number;
  energyCost?: number;
}

const GOALS_PATH = "memory/goals.md";

export class GoalMemory {
  private goals = new Map<string, Goal>();
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;
    let text = "";
    try {
      text = await fs.readFile(GOALS_PATH, "utf8");
    } catch (err: any) {
      if (err && err.code === "ENOENT") {
        this.loaded = true;
        return;
      }
      throw err;
    }
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    for (const line of lines) {
      const raw = line.startsWith("-") ? line.slice(1).trim() : line;
      try {
        const goal = JSON.parse(raw) as Goal;
        this.goals.set(goal.id, goal);
      } catch {
        // ignore malformed lines
      }
    }
    this.loaded = true;
  }

  private async save(): Promise<void> {
    await fs.mkdir("memory", { recursive: true });
    const lines: string[] = [];
    for (const goal of this.goals.values()) {
      lines.push(`- ${JSON.stringify(goal)}`);
    }
    await fs.writeFile(GOALS_PATH, lines.join("\n") + (lines.length ? "\n" : ""), "utf8");
  }

  async getActive(): Promise<Goal[]> {
    await this.load();
    return Array.from(this.goals.values()).filter((g) => g.status === "active");
  }

  async getRunnable(): Promise<Goal[]> {
    await this.load();
    return Array.from(this.goals.values()).filter(
      (g) => g.status === "active" || g.status === "paused"
    );
  }

  async get(goalId: string): Promise<Goal | undefined> {
    await this.load();
    return this.goals.get(goalId);
  }

  async findByText(goalText: string): Promise<Goal | undefined> {
    await this.load();
    const normalized = goalText.trim();
    for (const g of this.goals.values()) {
      if (g.goal.trim() === normalized && (g.status === "active" || g.status === "paused")) {
        return g;
      }
    }
    return undefined;
  }

  async add(input: { id: string; goal: string; status?: Goal["status"] }): Promise<Goal> {
    await this.load();
    const existing = await this.findByText(input.goal);
    if (existing) return existing;

    const now = Date.now();
    const goal: Goal = {
      id: input.id,
      goal: input.goal,
      status: input.status ?? "active",
      createdAt: now,
      updatedAt: now,
      iterations: 0
    };
    this.goals.set(goal.id, goal);
    await this.save();
    return goal;
  }

  async update(goalId: string, updates: Partial<Omit<Goal, "id" | "createdAt">>): Promise<Goal | undefined> {
    await this.load();
    const existing = this.goals.get(goalId);
    if (!existing) return undefined;
    const merged: Goal = {
      ...existing,
      ...updates,
      updatedAt: Date.now()
    };
    this.goals.set(goalId, merged);
    await this.save();
    return merged;
  }

  async markComplete(goalId: string): Promise<Goal | undefined> {
    return this.update(goalId, { status: "completed" });
  }

  async listAll(): Promise<Goal[]> {
    await this.load();
    return Array.from(this.goals.values());
  }
}

export const goalMemory = new GoalMemory();

