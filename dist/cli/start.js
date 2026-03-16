import { runMcpServer } from "../mcp/server.js";
async function main() {
    await runMcpServer();
}
main().catch(err => {
    // eslint-disable-next-line no-console
    console.error("CLI failed", err);
    process.exit(1);
});
