import * as http from "http";
import { MemoryService } from "../memory/MemoryService";
import { AgentRegistry } from "../cognition/agentRegistry";
import { OperationLog } from "../cognition/operationLog";
import { ChangeBroadcast } from "../cognition/changeBroadcast";
import { CognitionCoordinator } from "../cognition/cognitionCoordinator";
import { createTools } from "./tools";
import { now } from "../utils/time";

async function main() {
  const memory = new MemoryService();
  await memory.loadAll("system");

  const agents = new AgentRegistry();
  const opLog = new OperationLog();
  const broadcaster = new ChangeBroadcast();
  const coordinator = new CognitionCoordinator(memory, agents, opLog, broadcaster);
  const tools = createTools(coordinator);

  const server = http.createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== "/mcp") {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }

    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", async () => {
      try {
        const body = Buffer.concat(chunks).toString("utf8");
        const { tool, params } = JSON.parse(body);
        const fn = (tools as any)[tool];
        if (!fn) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Unknown tool" }));
          return;
        }
        const result = await fn(params ?? {});
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ result }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err?.message ?? "Internal error" }));
      }
    });
  });

  const port = Number(process.env.PORT ?? 7070);
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[MCP] Server listening on port ${port} at ${now()}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start MCP server", err);
  process.exit(1);
});

