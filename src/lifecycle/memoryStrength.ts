import { MemoryItem } from "../types";

export interface StrengthOptions {
  now?: number;
  decayRatePerHour?: number;
}

export interface StrengthResult {
  strength: number;
  recencyWeight: number;
  decay: number;
}

export function computeMemoryStrength(
  item: MemoryItem,
  options: StrengthOptions = {}
): StrengthResult {
  const now = options.now ?? Date.now();
  const decayRate = options.decayRatePerHour ?? 0.001;

  const importance = item.importance ?? 0.5;
  const accessCount = item.accessCount ?? 0;

  const lastAccess = item.lastAccessed ?? now;
  const hoursSinceAccess = Math.max(
    0,
    (now - lastAccess) / (1000 * 60 * 60)
  );
  const recencyWeight = 1 / (hoursSinceAccess + 1);

  let ageInHours = 0;
  if (item.firstSeen) {
    const t = Date.parse(item.firstSeen);
    if (!isNaN(t)) {
      ageInHours = Math.max(0, (now - t) / (1000 * 60 * 60));
    }
  }
  const decay = ageInHours * decayRate;

  const strength =
    importance * 3 +
    Math.log(accessCount + 1) +
    recencyWeight -
    decay;

  return { strength, recencyWeight, decay };
}

