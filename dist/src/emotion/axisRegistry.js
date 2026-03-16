const AXIS_KEY = {
    valence: { id: "valence", description: "Pleasantness vs unpleasantness" },
    arousal: { id: "arousal", description: "Activation vs calm" },
    tension: { id: "tension", description: "Tension vs ease" },
    social: { id: "social", description: "Connected vs isolated" }
};
export function loadAxisRegistry() {
    return { ...AXIS_KEY };
}
