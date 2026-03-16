import { appendFile } from "fs/promises";
import path from "path";
import { generateId } from "../utils/ids";
import { now, toIso } from "../utils/time";

export interface Operation {
  id: string;
  agentId: string;
  action: string;
  targetMemoryId?: string;
  payload: any;
  timestamp: number;
}

const OPERATIONS_LOG_PATH = path.resolve("memory/operations.log");

export function createOperation(params: Omit<Operation, "id" | "timestamp">): Operation {
  return {
    id: generateId("op"),
    timestamp: now(),
    ...params
  };
}

export async function appendOperation(operation: Operation): Promise<void> {
  const summary =
    typeof operation.payload === "string"
      ? operation.payload.slice(0, 80)
      : JSON.stringify(operation.payload).slice(0, 80);
  const line = `${toIso(operation.timestamp)},${operation.id},${operation.agentId},${operation.action},${operation.targetMemoryId ?? ""},${summary}\n`;
  await appendFile(OPERATIONS_LOG_PATH, line, "utf8");
}

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

