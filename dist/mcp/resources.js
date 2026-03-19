import { promises as fs } from "node:fs";
import { getPamDataDir, pamDataFile } from "../config/runtime.js";
const PATHS = {
    "user://identity": pamDataFile("identity_core.md"),
    "user://timeline": pamDataFile("life_timeline.md"),
    "user://current-state": pamDataFile("current_state.md"),
    "user://creative-lab": pamDataFile("creative_lab.md"),
    "user://projects": pamDataFile("project_tracker.md"),
    "user://reflections": pamDataFile("reflections.md"),
    "user://predictions": pamDataFile("predictions.md"),
    "user://emotional-state": pamDataFile("emotional_vectors.md"),
    "user://agents": pamDataFile("operations.log")
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
            await fs.mkdir(getPamDataDir(), { recursive: true });
            await fs.writeFile(path, "", "utf8");
            return "";
        }
        throw err;
    }
}
