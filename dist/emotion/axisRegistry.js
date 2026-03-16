"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAxisRegistry = loadAxisRegistry;
const AXIS_KEY = {
    valence: { id: "valence", description: "Pleasantness vs unpleasantness" },
    arousal: { id: "arousal", description: "Activation vs calm" },
    tension: { id: "tension", description: "Tension vs ease" },
    social: { id: "social", description: "Connected vs isolated" }
};
function loadAxisRegistry() {
    return { ...AXIS_KEY };
}
