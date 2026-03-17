import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createAIOS } from "../sdk/createAIOS.js";
import { getResource } from "./resources.js";
import { createTools } from "./tools.js";
function wrapResult(result) {
    return [
        {
            type: "text",
            text: JSON.stringify(result)
        }
    ];
}
export async function runMcpServer() {
    const server = new McpServer({
        name: "freqkflag-ai-os",
        version: "0.1.0"
    }, {
        capabilities: {
            tools: {},
            resources: {}
        }
    });
    const aios = await createAIOS();
    const tools = createTools(aios.cognition.coordinator);
    // Tools
    server.registerTool("get_user_summary", {
        description: "Summarize current user context and agents",
        inputSchema: z.object({})
    }, async () => {
        const result = await tools.get_user_summary();
        return { content: wrapResult(result) };
    });
    server.registerTool("get_relevant_context", {
        description: "Run hybrid retrieval for a natural-language query",
        inputSchema: z.object({ query: z.string() })
    }, async ({ query }) => {
        const result = await tools.get_relevant_context({ query });
        return { content: wrapResult(result) };
    });
    server.registerTool("generate_reflection", {
        description: "Generate insights and counterfactuals from current memory",
        inputSchema: z.object({
            mode: z.enum(["identityConsolidation", "problemSolving", "timelineReview"]).optional()
        })
    }, async ({ mode }) => {
        const result = await tools.generate_reflection(mode ? { mode } : {});
        return { content: wrapResult(result) };
    });
    server.registerTool("generate_predictions", {
        description: "Generate predictive memories from current state",
        inputSchema: z.object({})
    }, async () => {
        const result = await tools.generate_predictions();
        return { content: wrapResult(result) };
    });
    server.registerTool("record_prediction_outcome", {
        description: "Record whether a prediction was correct or incorrect",
        inputSchema: z.object({
            predId: z.string(),
            correct: z.boolean()
        })
    }, async ({ predId, correct }) => {
        const result = await tools.record_prediction_outcome({ predId, correct });
        return { content: wrapResult(result) };
    });
    server.registerTool("self_evaluate", {
        description: "Return a unified self-evaluation health snapshot",
        inputSchema: z.object({})
    }, async () => {
        const result = await tools.self_evaluate();
        return { content: wrapResult(result) };
    });
    server.registerTool("register_agent", {
        description: "Register an external agent with the cognition layer",
        inputSchema: z.object({
            id: z.string(),
            name: z.string(),
            type: z.string()
        })
    }, async ({ id, name, type }) => {
        const result = await tools.register_agent({ id, name, type });
        return { content: wrapResult(result) };
    });
    server.registerTool("test_insight", {
        description: "Verify an insight against evidence episodes",
        inputSchema: z.object({ text: z.string() })
    }, async ({ text }) => {
        const result = await tools.test_insight({ text });
        return { content: wrapResult(result) };
    });
    server.registerTool("create_task", {
        description: "Create a multi-agent task plan",
        inputSchema: z.object({ goal: z.string() })
    }, async ({ goal }) => {
        const result = await tools.create_task({ goal });
        return { content: wrapResult(result) };
    });
    server.registerTool("agent_status", {
        description: "List registered agents",
        inputSchema: z.object({})
    }, async () => {
        const result = await tools.agent_status();
        return { content: wrapResult(result) };
    });
    server.registerTool("system_report", {
        description: "Run system introspection and return metrics and alerts",
        inputSchema: z.object({})
    }, async () => {
        const result = await tools.system_report();
        return { content: wrapResult(result) };
    });
    server.registerTool("ingest_document_summary", {
        description: "Ingest a document summary into markdown memory",
        inputSchema: z.object({
            text: z.string().describe("Summary text to store"),
            domain: z
                .string()
                .optional()
                .describe("Optional memory domain (identity, timeline, current_state, creative, projects, reflection, prediction, emotion)"),
            source: z.string().optional().describe("Optional source identifier or filename")
        })
    }, async ({ text, domain, source }) => {
        const result = await tools.ingest_document_summary({ text, domain, source });
        return { content: wrapResult(result) };
    });
    // Resources
    const resourceUris = [
        "user://identity",
        "user://timeline",
        "user://current-state",
        "user://creative-lab",
        "user://projects",
        "user://reflections",
        "user://predictions",
        "user://emotional-state",
        "user://agents"
    ];
    for (const uri of resourceUris) {
        const id = uri.split("://")[1] ?? uri;
        server.registerResource(id, uri, {
            title: id,
            description: `Resource ${uri}`,
            mimeType: "text/markdown"
        }, async (resUri) => ({
            contents: [{ uri: resUri.href, text: await getResource(uri) }]
        }));
    }
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
if (import.meta.url === `file://${process.argv[1]}`) {
    runMcpServer().catch(err => {
        // log only to stderr; stdout is reserved for MCP
        console.error("MCP server failed", err);
        process.exit(1);
    });
}
