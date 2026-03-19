import http from "node:http";
import { URL } from "node:url";
import { createAIOS } from "../sdk/index.js";
import { TOOL_DEFINITIONS } from "../mcp/tools.js";
import { getRuntimeConfig } from "../config/runtime.js";
import { getToolManifest } from "../mcp/toolManifest.js";
import { authorizeRequest, HttpUnauthorizedError } from "./auth.js";

const MAX_BODY_BYTES = 1024 * 1024;

class HttpError extends Error {
  statusCode: number;
  safeMessage: string;

  constructor(statusCode: number, safeMessage: string) {
    super(safeMessage);
    this.statusCode = statusCode;
    this.safeMessage = safeMessage;
    this.name = "HttpError";
  }
}

function sendJson(res: http.ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readJsonBody(req: http.IncomingMessage, maxBytes = MAX_BODY_BYTES): Promise<Record<string, any>> {
  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.length;
    if (total > maxBytes) throw new HttpError(400, "Invalid JSON");
    chunks.push(buf);
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new HttpError(400, "Invalid JSON");
  }

  return parsed as Record<string, any>;
}

async function main() {
  const aios = await createAIOS();
  const coordinator = aios.cognition.coordinator;

  const { host, port, baseUrl } = getRuntimeConfig();

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

      if (req.method === "GET" && url.pathname === "/health") {
        sendJson(res, 200, { ok: true, service: "pam", baseUrl });
        return;
      }

      if (req.method === "GET" && url.pathname === "/tools") {
        authorizeRequest(req);
        sendJson(res, 200, getToolManifest());
        return;
      }

      const toolMatch = url.pathname.match(/^\/tool\/([^/]+)$/);
      if (toolMatch) {
        authorizeRequest(req);

        if (req.method !== "POST") {
          sendJson(res, 405, { ok: false, error: "Method not allowed" });
          return;
        }

        const toolName = decodeURIComponent(toolMatch[1] ?? "");
        const tool = TOOL_DEFINITIONS.find((t) => t.name === toolName);
        if (!tool) {
          sendJson(res, 404, { ok: false, error: "Tool not found" });
          return;
        }

        const args = await readJsonBody(req);
        const result = await tool.handler(coordinator, args ?? {});
        sendJson(res, 200, result);
        return;
      }

      sendJson(res, 404, { ok: false, error: "Not found" });
    } catch (err) {
      if (err instanceof HttpUnauthorizedError) {
        sendJson(res, 401, { ok: false, error: "Unauthorized" });
        return;
      }

      if (err instanceof HttpError) {
        sendJson(res, err.statusCode, { ok: false, error: err.safeMessage });
        return;
      }

      // Never leak stack traces or local file paths.
      sendJson(res, 500, { ok: false, error: "Internal server error" });
    }
  });

  server.listen(port, host, () => {
    // eslint-disable-next-line no-console
    console.log(`PAM HTTP tool bridge listening on http://${host}:${port}`);
  });
}

main().catch(() => {
  // eslint-disable-next-line no-console
  console.error("HTTP server failed");
  process.exit(1);
});

