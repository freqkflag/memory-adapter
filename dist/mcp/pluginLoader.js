import { promises as fs } from "node:fs";
import path from "node:path";
const PLUGINS_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "plugins");
export async function loadPluginTools() {
    let entries = [];
    try {
        entries = await fs.readdir(PLUGINS_DIR);
    }
    catch (err) {
        if (err && err.code === "ENOENT") {
            return [];
        }
        throw err;
    }
    const tools = [];
    for (const file of entries) {
        if (!file.endsWith(".js"))
            continue;
        const fullPath = path.join(PLUGINS_DIR, file);
        const moduleUrl = pathToFileUrl(fullPath).href;
        const mod = (await import(moduleUrl));
        if (mod.default && Array.isArray(mod.default.tools)) {
            tools.push(...mod.default.tools);
        }
    }
    return tools;
}
function pathToFileUrl(p) {
    let resolved = path.resolve(p);
    if (process.platform === "win32") {
        resolved = resolved.replace(/\\/g, "/");
        if (!resolved.startsWith("/")) {
            resolved = `/${resolved}`;
        }
    }
    return new URL(`file://${resolved}`);
}
