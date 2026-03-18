import http from "node:http";
import { URL } from "node:url";
import { createAIOS } from "../sdk/index.js";
import { TOOL_DEFINITIONS } from "../mcp/tools.js";
const DEFAULT_PORT = 8787;
const port = Number(process.env.PORT ?? DEFAULT_PORT);
function safeErrorMessage(err) {
    if (err instanceof Error)
        return err.message;
    return "Unknown error";
}
function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(body));
}
async function readJsonBody(req, maxBytes = 1024 * 1024) {
    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        total += buf.length;
        if (total > maxBytes)
            throw new Error("Request body too large");
        chunks.push(buf);
    }
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    if (!raw)
        return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return {};
    }
    return parsed;
}
async function main() {
    const aios = await createAIOS();
    const coordinator = aios.cognition.coordinator;
    const server = http.createServer(async (req, res) => {
        try {
            if (req.method !== "POST") {
                sendJson(res, 405, { ok: false, error: "Method not allowed" });
                return;
            }
            const host = req.headers.host ?? "localhost";
            const url = new URL(req.url ?? "/", `http://${host}`);
            const match = url.pathname.match(/^\/tool\/([^/]+)$/);
            if (!match) {
                sendJson(res, 404, { ok: false, error: "Not found" });
                return;
            }
            const toolName = decodeURIComponent(match[1] ?? "");
            const tool = TOOL_DEFINITIONS.find(t => t.name === toolName);
            if (!tool) {
                sendJson(res, 404, { ok: false, error: "Tool not found" });
                return;
            }
            const args = await readJsonBody(req);
            const result = await tool.handler(coordinator, args ?? {});
            sendJson(res, 200, result);
        }
        catch (err) {
            sendJson(res, 500, { ok: false, error: safeErrorMessage(err) });
        }
    });
    server.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`PAM HTTP tool bridge listening on http://localhost:${port}`);
    });
}
main().catch(err => {
    // eslint-disable-next-line no-console
    console.error("HTTP server failed", safeErrorMessage(err));
    process.exit(1);
});
