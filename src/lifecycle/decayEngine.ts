import { MemoryItem } from "../types";
import { computeMemoryStrength, StrengthOptions } from "./memoryStrength";

export interface DecayEngineOptions extends StrengthOptions {
  strengthThreshold?: number;
}

export interface DecayEngineResult {
  items: MemoryItem[];
  decayCandidates: MemoryItem[];
}

export function runDecayEngine(
  items: MemoryItem[],
  options: DecayEngineOptions = {}
): DecayEngineResult {
  const strengthThreshold = options.strengthThreshold ?? 0.5;
  const updated: MemoryItem[] = [];
  const decayCandidates: MemoryItem[] = [];

  for (const item of items) {
    const { strength } = computeMemoryStrength(item, options);
    const next: MemoryItem = {
      ...item,
      strength,
    };
    updated.push(next);
    if (strength < strengthThreshold) {
      decayCandidates.push(next);
    }
  }

  return { items: updated, decayCandidates };
}

