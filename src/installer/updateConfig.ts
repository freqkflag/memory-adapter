import { promises as fs } from "node:fs";
import path from "node:path";

export interface McpServerEntry {
  command: string;
  args: string[];
}

export async function updateConfig(configPath: string, serverName: string, entry: McpServerEntry): Promise<void> {
  const dir = path.dirname(configPath);
  await fs.mkdir(dir, { recursive: true });

  let raw = "{}";
  try {
    raw = await fs.readFile(configPath, "utf8");
    if (!raw.trim()) {
      raw = "{}";
    }
  } catch (err: any) {
    if (err && err.code !== "ENOENT") {
      throw err;
    }
  }

  let config: any;
  try {
    config = JSON.parse(raw);
  } catch {
    config = {};
  }

  if (typeof config !== "object" || config === null) {
    config = {};
  }

  if (!config.mcpServers || typeof config.mcpServers !== "object") {
    config.mcpServers = {};
  }

  const servers = config.mcpServers as Record<string, McpServerEntry>;
  if (!servers[serverName]) {
    servers[serverName] = entry;
  }

  const updated = JSON.stringify(config, null, 2) + "\n";
  await fs.writeFile(configPath, updated, "utf8");
}

