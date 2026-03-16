export type AxisKey = string;

export interface AxisDefinition {
  id: AxisKey;
  description: string;
}

export const AXIS_KEY: Record<AxisKey, AxisDefinition> = {
  valence: { id: "valence", description: "Pleasantness vs. unpleasantness" },
  arousal: { id: "arousal", description: "Activation vs. calm" },
  tension: { id: "tension", description: "Tension vs. relaxation" },
  safety: { id: "safety", description: "Perceived safety vs. threat" }
};

export function listAxes(): AxisDefinition[] {
  return Object.values(AXIS_KEY);
}

