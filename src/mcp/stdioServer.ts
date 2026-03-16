// NOTE: This file sketches an MCP stdio server following the official SDK pattern,
// but the @modelcontextprotocol/server package is not installed in this repo.
// To actually use this in Cursor, install that package and uncomment the imports below.
/*
import { McpServer, StdioServerTransport, type CallToolResult } from "@modelcontextprotocol/server";
import * as z from "zod";
import { createTools } from "./tools";
import { MemoryService } from "../memory/MemoryService";
import { AgentRegistry } from "../cognition/agentRegistry";
import { OperationLog } from "../cognition/operationLog";
import { ChangeBroadcast } from "../cognition/changeBroadcast";
import { CognitionCoordinator } from "../cognition/cognitionCoordinator";

async function main() {
  const server = new McpServer(
    { name: "personal-ai-os", version: "0.1.0" },
    {
      capabilities: {
        tools: {},
        resources: {}
      }
    }
  );

  // Core services shared by tools
  const memory = new MemoryService();
  await memory.loadAll("mcp");

  const agents = new AgentRegistry();
  const opLog = new OperationLog();
  const broadcaster = new ChangeBroadcast();
  const coordinator = new CognitionCoordinator(memory, agents, opLog, broadcaster);
  const tools = createTools(coordinator);

  // Tool: get_user_summary
  server.registerTool(
    "get_user_summary",
    {
      title: "Get user summary",
      description: "Summarize current user context and agents",
      inputSchema: z.object({})
    },
    async () => {
      const result = await tools.get_user_summary();
      const text = JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] } satisfies CallToolResult;
    }
  );

  // Tool: get_relevant_context
  server.registerTool(
    "get_relevant_context",
    {
      title: "Get relevant context",
      description: "Run hybrid retrieval for a natural-language query",
      inputSchema: z.object({ query: z.string() })
    },
    async ({ query }) => {
      const result = await tools.get_relevant_context({ query });
      const text = JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] } satisfies CallToolResult;
    }
  );

  // Tool: generate_reflection
  server.registerTool(
    "generate_reflection",
    {
      title: "Generate reflection",
      description: "Generate insights and counterfactuals from current memory",
      inputSchema: z.object({})
    },
    async () => {
      const result = await tools.generate_reflection();
      const text = JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] } satisfies CallToolResult;
    }
  );

  // Tool: generate_predictions
  server.registerTool(
    "generate_predictions",
    {
      title: "Generate predictions",
      description: "Generate predictive memories from current state",
      inputSchema: z.object({})
    },
    async () => {
      const result = await tools.generate_predictions();
      const text = JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] } satisfies CallToolResult;
    }
  );

  // Tool: register_agent
  server.registerTool(
    "register_agent",
    {
      title: "Register agent",
      description: "Register an external agent with the cognition layer",
      inputSchema: z.object({
        id: z.string(),
        name: z.string(),
        type: z.string()
      })
    },
    async ({ id, name, type }) => {
      const result = await tools.register_agent({ id, name, type });
      const text = JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] } satisfies CallToolResult;
    }
  );

  // Tool: test_insight
  server.registerTool(
    "test_insight",
    {
      title: "Test insight",
      description: "Verify an insight against evidence episodes",
      inputSchema: z.object({ text: z.string() })
    },
    async ({ text }) => {
      const result = await tools.test_insight({ text });
      const textOut = JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text: textOut }] } satisfies CallToolResult;
    }
  );

  // Tool: create_task
  server.registerTool(
    "create_task",
    {
      title: "Create task",
      description: "Create a multi-agent task plan",
      inputSchema: z.object({ goal: z.string() })
    },
    async ({ goal }) => {
      const result = await tools.create_task({ goal });
      const text = JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] } satisfies CallToolResult;
    }
  );

  // Tool: agent_status
  server.registerTool(
    "agent_status",
    {
      title: "Agent status",
      description: "List registered agents",
      inputSchema: z.object({})
    },
    async () => {
      const result = await tools.agent_status();
      const text = JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] } satisfies CallToolResult;
    }
  );

  // Tool: system_report
  server.registerTool(
    "system_report",
    {
      title: "System report",
      description: "Run system introspection and return metrics + alerts",
      inputSchema: z.object({})
    },
    async () => {
      const result = await tools.system_report();
      const text = JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] } satisfies CallToolResult;
    }
  );

  // Resources backed by markdown memory files
  server.registerResource(
    "identity",
    "user://identity",
    {
      title: "Identity core",
      description: "Identity and self-model markdown",
      mimeType: "text/markdown"
    },
    async uri => ({
      contents: [{ uri: uri.href, text: await (await import("./resources")).getResource("user://identity") }]
    })
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error("MCP stdio server failed", err);
  process.exit(1);
});
*/

// Temporary placeholder main to keep TypeScript compiling without the MCP SDK.
export {};

