import { runMcpServer } from "../mcp/server.js";
import { runInstaller } from "../installer/installMCP.js";

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "install") {
    await runInstaller();
    return;
  }

  await runMcpServer();
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error("CLI failed", err);
  process.exit(1);
});


