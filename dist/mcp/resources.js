import { promises as fs } from "node:fs";
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
export async function getResource(uri) {
    const path = PATHS[uri];
    if (!path) {
        throw new Error(`Unknown resource URI: ${uri}`);
    }
    try {
        return await fs.readFile(path, "utf8");
    }
    catch (err) {
        if (err && err.code === "ENOENT" && uri === "user://agents") {
            // Ensure operations log exists for agents resource
            await fs.mkdir("memory", { recursive: true });
            await fs.writeFile(path, "", "utf8");
            return "";
        }
        throw err;
    }
}
