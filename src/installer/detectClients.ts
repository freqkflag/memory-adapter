import { promises as fs } from "node:fs";
import path from "node:path";
import { getClaudeConfigPath, getCursorConfigPath } from "./paths.js";

export interface DetectedClients {
  cursor: boolean;
  claude: boolean;
}

async function fileExists(p: string): Promise<boolean> {
  try {
    const stat = await fs.stat(p);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function dirExists(p: string): Promise<boolean> {
  try {
    const stat = await fs.stat(p);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export async function detectClients(): Promise<DetectedClients> {
  const claudePath = getClaudeConfigPath();
  const cursorConfigPath = getCursorConfigPath();

  const claude = await fileExists(claudePath);

  // For Cursor we only need the parent directory to exist; the MCP config file may not yet exist.
  const cursorDir = path.dirname(cursorConfigPath);
  const cursor = await dirExists(cursorDir);

  return { cursor, claude };
}

