import { promises as fs } from "fs";
import { generateId } from "../utils/ids.js";
import { now } from "../utils/time.js";

export interface Operation {
  id: string;
  agentId: string;
  action: string;
  targetMemoryId?: string;
  payload: any;
  timestamp: number;
}

const LOG_PATH = "memory/operations.log";

export class OperationLog {
  async record(op: Omit<Operation, "id" | "timestamp">): Promise<Operation> {
    const full: Operation = {
      ...op,
      id: generateId("op"),
      timestamp: now()
    };
    const line = JSON.stringify(full);
    await fs.appendFile(LOG_PATH, line + "\n", "utf8");
    return full;
  }
}

