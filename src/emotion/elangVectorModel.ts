import { ELangVector } from "./elangParser";

export function distance(a: ELangVector, b: ELangVector): number {
  const axes = new Set([...Object.keys(a.axes), ...Object.keys(b.axes)]);
  let sumSq = 0;
  for (const key of axes) {
    const av = a.axes[key] ?? 0;
    const bv = b.axes[key] ?? 0;
    const diff = av - bv;
    sumSq += diff * diff;
  }
  return Math.sqrt(sumSq);
}

export function blend(vectors: ELangVector[]): ELangVector | null {
  if (vectors.length === 0) return null;
  const axes = new Set<string>();
  for (const v of vectors) {
    Object.keys(v.axes).forEach((k) => axes.add(k));
  }

  const resultAxes: Record<string, number> = {};
  for (const key of axes) {
    let sum = 0;
    for (const v of vectors) {
      sum += v.axes[key] ?? 0;
    }
    resultAxes[key] = sum / vectors.length;
  }

  const latestTs = Math.max(...vectors.map((v) => v.timestamp));
  return {
    axes: resultAxes,
    timestamp: latestTs,
    source: "user"
  };
}

