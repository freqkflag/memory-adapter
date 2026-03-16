import fs from "fs";
import path from "path";

export interface Operation {
  id: string;
  agentId: string;
  action: string;
  targetMemoryId?: string;
  payload: any;
  timestamp: number;
}

export class OperationLog {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  private get logPath(): string {
    return path.join(this.baseDir, "memory/operations.log");
  }

  append(op: Operation): void {
    fs.mkdirSync(path.dirname(this.logPath), { recursive: true });
    fs.appendFileSync(this.logPath, JSON.stringify(op) + "\n", "utf8");
  }

  tail(limit: number = 50): Operation[] {
    try {
      const raw = fs.readFileSync(this.logPath, "utf8");
      const lines = raw.trim().split(/\r?\n/);
      const slice = lines.slice(-limit);
      const ops: Operation[] = [];
      for (const line of slice) {
        try {
          ops.push(JSON.parse(line));
        } catch {
          // ignore bad lines
        }
      }
      return ops;
    } catch {
      return [];
    }
  }
}

