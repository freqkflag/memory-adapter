import { Insight, MemoryDomain, MemoryDurability, MemoryItem } from "../types";

export interface PromoteOptions {
  promotionThreshold?: number;
}

export function promoteInsights(
  insights: Insight[],
  options: PromoteOptions = {}
): MemoryItem[] {
  const threshold = options.promotionThreshold ?? 0.6;
  const promoted: MemoryItem[] = [];

  for (const ins of insights) {
    if (ins.confidence < threshold) continue;

    const domain: MemoryDomain = "identity";
    const durability: MemoryDurability = "stable";

    const id = `insight-${ins.createdAt}-${Math.abs(
      ins.text.hashCode?.() ?? ins.text.length
    )}`;

    const item: MemoryItem = {
      id,
      domain,
      durability,
      sectionPath: ["Reflections"],
      text: ins.text,
      tags: ["insight", ins.category],
      sourceFile: "memory/reflections.md",
      importance: 3.5,
      accessCount: 0,
      strength: ins.confidence * 3,
      conflictGroupKey: undefined,
      embedding: undefined,
      lastAccessed: undefined,
    };
    promoted.push(item);
  }

  return promoted;
}

declare global {
  interface String {
    hashCode(): number;
  }
}

if (!String.prototype.hashCode) {
  // eslint-disable-next-line no-extend-native
  String.prototype.hashCode = function (): number {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
      const chr = this.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  };
}

