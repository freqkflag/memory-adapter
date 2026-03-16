import { MemoryItem, MemoryDurability } from "../types";

export interface LifecycleConfig {
  decayStrengthThreshold: number;
  archiveStrengthThreshold: number;
  promotionAccessThreshold: number;
}

export const DEFAULT_LIFECYCLE_CONFIG: LifecycleConfig = {
  decayStrengthThreshold: 0.5,
  archiveStrengthThreshold: 0.0,
  promotionAccessThreshold: 10,
};

export interface PromotionDecision {
  id: string;
  from: MemoryDurability;
  to: MemoryDurability;
}

export interface ArchiveDecision {
  id: string;
  item: MemoryItem;
}

export function findArchiveCandidates(
  items: MemoryItem[],
  config: LifecycleConfig = DEFAULT_LIFECYCLE_CONFIG
): ArchiveDecision[] {
  const decisions: ArchiveDecision[] = [];
  for (const item of items) {
    if (item.archived) continue;
    const strength = item.strength ?? 0;
    if (strength < config.archiveStrengthThreshold) {
      decisions.push({ id: item.id, item });
    }
  }
  return decisions;
}

export function findPromotionCandidates(
  items: MemoryItem[],
  config: LifecycleConfig = DEFAULT_LIFECYCLE_CONFIG
): PromotionDecision[] {
  const decisions: PromotionDecision[] = [];
  for (const item of items) {
    const count = item.accessCount ?? 0;
    if (count <= config.promotionAccessThreshold) continue;

    if (item.durability === "dynamic") {
      decisions.push({ id: item.id, from: "dynamic", to: "semi_stable" });
    } else if (item.durability === "semi_stable") {
      decisions.push({ id: item.id, from: "semi_stable", to: "stable" });
    }
  }
  return decisions;
}

