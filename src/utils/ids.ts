import { randomUUID } from "crypto";

export function generateId(prefix: string = "id"): string {
  try {
    return `${prefix}_${randomUUID()}`;
  } catch {
    const randomPart = Math.random().toString(36).slice(2);
    const timePart = Date.now().toString(36);
    return `${prefix}_${timePart}_${randomPart}`;
  }
}

