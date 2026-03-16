"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResource = getResource;
const fs_1 = require("fs");
const PATHS = {
    "user://identity": "memory/identity_core.md",
    "user://timeline": "memory/life_timeline.md",
    "user://current-state": "memory/current_state.md",
    "user://creative-lab": "memory/creative_lab.md",
    "user://projects": "memory/project_tracker.md",
    "user://reflections": "memory/reflections.md",
    "user://predictions": "memory/predictions.md",
    "user://emotional-state": "memory/emotional_vectors.md",
    "user://agents": "memory/operations.log"
};
async function getResource(uri) {
    const path = PATHS[uri];
    if (!path) {
        throw new Error(`Unknown resource URI: ${uri}`);
    }
    return fs_1.promises.readFile(path, "utf8");
}
