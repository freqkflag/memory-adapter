import { detectClients } from "./detectClients.js";
import { getClaudeConfigPath, getCursorConfigPath } from "./paths.js";
import { updateConfig } from "./updateConfig.js";

export async function runInstaller(): Promise<void> {
  const detected = await detectClients();
  const serverEntry = {
    command: "npx",
    args: ["ai-os"]
  };

  if (detected.claude) {
    const claudePath = getClaudeConfigPath();
    await updateConfig(claudePath, "ai-os", serverEntry);
    // eslint-disable-next-line no-console
    console.log("✔ MCP server installed for Claude Desktop");
  } else {
    // eslint-disable-next-line no-console
    console.log("⚠ Claude Desktop config not found, skipping");
  }

  if (detected.cursor) {
    const cursorPath = getCursorConfigPath();
    await updateConfig(cursorPath, "ai-os", serverEntry);
    // eslint-disable-next-line no-console
    console.log("✔ MCP server installed for Cursor");
  } else {
    // eslint-disable-next-line no-console
    console.log("⚠ Cursor config not found, skipping");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runInstaller().catch(err => {
    // eslint-disable-next-line no-console
    console.error("MCP installer failed", err);
    process.exit(1);
  });
}

