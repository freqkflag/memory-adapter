import { MemoryItem } from "../memory/MemoryItem";

export function scorePrediction(text: string, memories: MemoryItem[]): number {
  const lc = text.toLowerCase();
  let support = 0;
  for (const m of memories) {
    if (m.text.toLowerCase().includes(lc.split(" ")[0] ?? "")) {
      support += 1;
    }
  }
  return Math.max(0.1, Math.min(0.95, support / (memories.length || 1)));
}

