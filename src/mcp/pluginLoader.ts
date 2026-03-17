import { promises as fs } from "node:fs";
import path from "node:path";
import type { ToolDefinition } from "./tools.js";

export interface ToolPlugin {
  name: string;
  tools: ToolDefinition[];
}

const PLUGINS_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "plugins"
);

export async function loadPluginTools(): Promise<ToolDefinition[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(PLUGINS_DIR);
  } catch (err: any) {
    if (err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }

  const tools: ToolDefinition[] = [];
  for (const file of entries) {
    if (!file.endsWith(".js")) continue;
    const fullPath = path.join(PLUGINS_DIR, file);
    const moduleUrl = pathToFileUrl(fullPath).href;
    const mod = (await import(moduleUrl)) as { default?: ToolPlugin };
    if (mod.default && Array.isArray(mod.default.tools)) {
      tools.push(...mod.default.tools);
    }
  }
  return tools;
}

function pathToFileUrl(p: string): URL {
  let resolved = path.resolve(p);
  if (process.platform === "win32") {
    resolved = resolved.replace(/\\/g, "/");
    if (!resolved.startsWith("/")) {
      resolved = `/${resolved}`;
    }
  }
  return new URL(`file://${resolved}`);
}

