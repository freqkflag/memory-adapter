import os from "node:os";
import path from "node:path";
function getHomeDir() {
    return os.homedir();
}
export function getClaudeConfigPath() {
    const home = getHomeDir();
    const platform = process.platform;
    if (platform === "darwin") {
        return path.join(home, "Library", "Application Support", "Claude", "claude_desktop_config.json");
    }
    if (platform === "win32") {
        const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
        return path.join(appData, "Claude", "claude_desktop_config.json");
    }
    // Linux and other unix-like
    return path.join(home, ".config", "Claude", "claude_desktop_config.json");
}
export function getCursorConfigPath() {
    const home = getHomeDir();
    const platform = process.platform;
    if (platform === "darwin") {
        // Cursor stores user data under globalStorage; we keep a separate MCP config file there.
        return path.join(home, "Library", "Application Support", "Cursor", "User", "globalStorage", "mcp.json");
    }
    if (platform === "win32") {
        const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
        return path.join(appData, "Cursor", "mcp.json");
    }
    // Linux and other unix-like
    return path.join(home, ".config", "Cursor", "mcp.json");
}
