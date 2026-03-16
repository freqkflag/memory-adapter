import { ELangVector } from "./elangVectorModel.js";

export function createTrajectory(points: ELangVector[]): ELangVector[] {
  return points.sort((a, b) => a.timestamp - b.timestamp);
}

