import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createAIOS } from "../sdk/createAIOS.js";
import { getResource } from "./resources.js";
import { TOOL_DEFINITIONS } from "./tools.js";
import { loadPluginTools } from "./pluginLoader.js";
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
    const coordinator = aios.cognition.coordinator;
    const pluginTools = await loadPluginTools();
    const allTools = [...TOOL_DEFINITIONS, ...pluginTools];
    // Tools: auto-registered from core + plugins
    for (const def of allTools) {
        server.registerTool(def.name, {
            description: def.description,
            inputSchema: def.inputSchema
        }, async (args) => {
            const result = await def.handler(coordinator, args ?? {});
            return { content: wrapResult(result) };
        });
    }
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
