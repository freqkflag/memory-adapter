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

