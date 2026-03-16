export interface AxisDefinition {
  id: string;
  description: string;
}

const AXIS_KEY: Record<string, AxisDefinition> = {
  valence: { id: "valence", description: "Pleasantness vs unpleasantness" },
  arousal: { id: "arousal", description: "Activation vs calm" },
  tension: { id: "tension", description: "Tension vs ease" },
  social: { id: "social", description: "Connected vs isolated" }
};

export function loadAxisRegistry(): Record<string, AxisDefinition> {
  return { ...AXIS_KEY };
}

