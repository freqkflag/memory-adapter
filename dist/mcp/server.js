"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const MemoryService_1 = require("../memory/MemoryService");
const agentRegistry_1 = require("../cognition/agentRegistry");
const operationLog_1 = require("../cognition/operationLog");
const changeBroadcast_1 = require("../cognition/changeBroadcast");
const cognitionCoordinator_1 = require("../cognition/cognitionCoordinator");
const tools_1 = require("./tools");
const time_1 = require("../utils/time");
async function main() {
    const memory = new MemoryService_1.MemoryService();
    await memory.loadAll("system");
    const agents = new agentRegistry_1.AgentRegistry();
    const opLog = new operationLog_1.OperationLog();
    const broadcaster = new changeBroadcast_1.ChangeBroadcast();
    const coordinator = new cognitionCoordinator_1.CognitionCoordinator(memory, agents, opLog, broadcaster);
    const tools = (0, tools_1.createTools)(coordinator);
    const server = http.createServer(async (req, res) => {
        if (req.method !== "POST" || req.url !== "/mcp") {
            res.statusCode = 404;
            res.end("Not found");
            return;
        }
        const chunks = [];
        req.on("data", (c) => chunks.push(c));
        req.on("end", async () => {
            try {
                const body = Buffer.concat(chunks).toString("utf8");
                const { tool, params } = JSON.parse(body);
                const fn = tools[tool];
                if (!fn) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "Unknown tool" }));
                    return;
                }
                const result = await fn(params ?? {});
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ result }));
            }
            catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err?.message ?? "Internal error" }));
            }
        });
    });
    const port = Number(process.env.PORT ?? 7070);
    server.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`[MCP] Server listening on port ${port} at ${(0, time_1.now)()}`);
    });
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start MCP server", err);
    process.exit(1);
});
