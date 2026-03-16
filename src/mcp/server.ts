import http from "http";
import { createDefaultMCPContext, get_user_summary } from "./tools";

export function startServer(port: number = 7070): void {
  const ctx = createDefaultMCPContext();

  const server = http.createServer(async (req, res) => {
    if (!req.url || req.method !== "GET") {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    if (req.url === "/health") {
      res.statusCode = 200;
      res.end("ok");
      return;
    }
    if (req.url.startsWith("/summary")) {
      const summary = await get_user_summary(ctx);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end(summary);
      return;
    }
    res.statusCode = 404;
    res.end("Unknown endpoint");
  });

  server.listen(port);
  // The server exposes MCP-style tools over simple HTTP for local use.
}

