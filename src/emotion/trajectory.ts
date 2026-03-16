import { ELangVector } from "./elangParser";
import { distance } from "./elangVectorModel";

export interface TrajectorySegment {
  from: ELangVector;
  to: ELangVector;
  delta: number;
}

export function buildTrajectory(vector: ELangVector): TrajectorySegment[] {
  const segments: TrajectorySegment[] = [];
  if (!vector.trajectory || vector.trajectory.length === 0) {
    return segments;
  }
  let current = vector;
  for (const next of vector.trajectory) {
    segments.push({
      from: current,
      to: next,
      delta: distance(current, next)
    });
    current = next;
  }
  return segments;
}

