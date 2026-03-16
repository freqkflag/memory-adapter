import path from "path";
// Use CommonJS-style requires to avoid tight coupling to SDK type declarations.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Server } = require("@modelcontextprotocol/sdk/server");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/dist/cjs/server/stdio.js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequestSchema,
} = require("@modelcontextprotocol/sdk");
type ListResourcesResult = {
  resources: {
    uri: string;
    name?: string;
    description?: string;
    mimeType?: string;
  }[];
};
import { z } from "zod";
import { MemoryService } from "./memory/MemoryService";
import { AgentRegistry } from "./cognition/agentRegistry";
import { CognitionCoordinator } from "./cognition/cognitionCoordinator";

const memoryBaseDir = process.cwd();
const memoryService = new MemoryService(memoryBaseDir);
const agentRegistry = new AgentRegistry(memoryBaseDir);
const cognitionCoordinator = new CognitionCoordinator(memoryBaseDir);

const server = new Server(
  {
    name: "joey-memory-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const resources: ListResourcesResult["resources"] = [
    {
      uri: "user://identity",
      name: "Identity",
      description: "Core identity and communication preferences for Joey.",
      mimeType: "text/markdown",
    },
    {
      uri: "user://timeline",
      name: "Life timeline",
      description: "Life timeline and major milestones.",
      mimeType: "text/markdown",
    },
    {
      uri: "user://current-state",
      name: "Current state",
      description: "Current projects, focus areas, and support needs.",
      mimeType: "text/markdown",
    },
    {
      uri: "user://creative-lab",
      name: "Creative lab",
      description: "Creative sandbox, ideas, and inspiration.",
      mimeType: "text/markdown",
    },
    {
      uri: "user://projects",
      name: "Projects",
      description: "Project tracker and backlog.",
      mimeType: "text/markdown",
    },
    {
      uri: "user://memory-architecture",
      name: "Memory architecture",
      description: "Overall AI memory architecture document.",
      mimeType: "text/markdown",
    },
    {
      uri: "user://summary",
      name: "User summary",
      description: "Operational summary synthesized from all memory domains.",
      mimeType: "text/markdown",
    },
    {
      uri: "user://reflections",
      name: "Reflections",
      description: "Synthesized insights and reflections about the user.",
      mimeType: "text/markdown",
    },
    {
      uri: "user://insight-evidence",
      name: "Insight evidence index",
      description: "Insights with their supporting episodes.",
      mimeType: "application/json",
    },
    {
      uri: "user://agents",
      name: "Registered agents",
      description: "Agents currently registered to interact with memory.",
      mimeType: "application/json",
    },
  ];
  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request: any) => {
  const uri = request.params.uri;
  if (uri === "user://identity") {
    const result = memoryService.getIdentity();
    if (!result.ok) throw new Error(result.error ?? "Failed to load identity");
    return {
      contents: [{ uri, mimeType: "text/markdown", text: result.data }],
    };
  }
  if (uri === "user://timeline") {
    const result = memoryService.getTimeline();
    if (!result.ok) throw new Error(result.error ?? "Failed to load timeline");
    return {
      contents: [{ uri, mimeType: "text/markdown", text: result.data }],
    };
  }
  if (uri === "user://current-state") {
    const result = memoryService.getCurrentState();
    if (!result.ok) throw new Error(result.error ?? "Failed to load current state");
    return {
      contents: [{ uri, mimeType: "text/markdown", text: result.data }],
    };
  }
  if (uri === "user://creative-lab") {
    const result = memoryService.getCreativeLab();
    if (!result.ok) throw new Error(result.error ?? "Failed to load creative lab");
    return {
      contents: [{ uri, mimeType: "text/markdown", text: result.data }],
    };
  }
  if (uri === "user://projects") {
    const result = memoryService.getProjects();
    if (!result.ok) throw new Error(result.error ?? "Failed to load projects");
    return {
      contents: [{ uri, mimeType: "text/markdown", text: result.data }],
    };
  }
  if (uri === "user://memory-architecture") {
    const result = memoryService.getArchitecture();
    if (!result.ok) throw new Error(result.error ?? "Failed to load architecture");
    return {
      contents: [{ uri, mimeType: "text/markdown", text: result.data }],
    };
  }
  if (uri === "user://summary") {
    const result = memoryService.getUserSummary();
    if (!result.ok) throw new Error(result.error ?? "Failed to build summary");
    return {
      contents: [{ uri, mimeType: "text/markdown", text: result.data }],
    };
  }

  if (uri === "user://reflections") {
    const reflectionsPath = path.join(memoryBaseDir, "memory/reflections.md");
    const content = require("fs").readFileSync(reflectionsPath, "utf8");
    return {
      contents: [{ uri, mimeType: "text/markdown", text: content }],
    };
  }

  if (uri === "user://insight-evidence") {
    const reflectionsPath = path.join(memoryBaseDir, "memory/reflections.md");
    const { parseMarkdownFile } = require("./markdown/parseMemory");
    const { buildEvidenceIndex, evidenceIndexToJSON } = require(
      "./reflection/evidenceIndex"
    );
    const items = parseMarkdownFile(memoryBaseDir, "memory/reflections.md");
    const dummyInsights = items.map((item: any) => ({
      text: item.text,
      category: "insight",
      confidence: 0.5,
      evidenceEpisodes: [],
      counterEvidenceEpisodes: [],
      contradictionCount: 0,
      createdAt: Date.now(),
      lastValidated: Date.now(),
      lastTested: Date.now(),
    }));
    const index = buildEvidenceIndex(dummyInsights);
    const jsonIndex = evidenceIndexToJSON(index);
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(jsonIndex, null, 2),
        },
      ],
    };
  }

  if (uri === "user://agents") {
    const agents = agentRegistry.listAgents();
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(agents, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource URI: ${uri}`);
});

const GetUserSummaryParams = z.object({
  focus: z.string().optional(),
});

const GetRelevantContextParams = z.object({
  query: z.string(),
  domains: z.array(z.string()).optional(),
  limit: z.number().int().positive().optional(),
});

const IngestMemoryParams = z.object({
  content: z.string(),
  domainHint: z
    .enum([
      "identity",
      "timeline",
      "current_state",
      "projects",
      "creative",
      "architecture",
    ])
    .optional(),
  durabilityHint: z.string().optional(),
  timeContext: z.string().optional(),
  store: z.enum(["none", "durable", "dynamic"]).optional(),
  dryRun: z.boolean().optional(),
});

const UpdateMemoryParams = z.object({
  targetDescription: z.string(),
  newContent: z.string(),
  domainHint: z
    .enum([
      "identity",
      "timeline",
      "current_state",
      "projects",
      "creative",
      "architecture",
    ])
    .optional(),
  store: z.enum(["none", "durable", "dynamic"]).optional(),
  dryRun: z.boolean().optional(),
});

const GenerateReflectionParams = z.object({
  episodes: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      timestamp: z.number(),
      tags: z.array(z.string()).optional(),
    })
  ),
});

const VerifyInsightParams = z.object({
  insightText: z.string(),
  episodes: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        timestamp: z.number(),
        tags: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

const TestInsightParams = z.object({
  insightText: z.string(),
  episodes: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        timestamp: z.number(),
        tags: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

const RegisterAgentParams = z.object({
  agentName: z.string(),
  agentType: z.enum(["chatgpt", "claude", "cursor", "other"]),
});

const AgentIngestMemoryParams = IngestMemoryParams.extend({
  agentId: z.string(),
});

const AgentUpdateMemoryParams = UpdateMemoryParams.extend({
  agentId: z.string(),
});

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const name = request.params.name;
  const args = (request.params.arguments ?? {}) as Record<string, unknown>;

  if (name === "get_user_summary") {
    const parsed = GetUserSummaryParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for get_user_summary");
    }
    const result = memoryService.getUserSummary(parsed.data.focus);
    if (!result.ok) throw new Error(result.error ?? "Failed to get user summary");
    return {
      content: [
        {
          type: "text",
          text: result.data,
        },
      ],
    };
  }

  if (name === "get_relevant_context") {
    const parsed = GetRelevantContextParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for get_relevant_context");
    }
    const res = await memoryService.getRelevantContext({
      query: parsed.data.query,
      domains: undefined,
      limit: parsed.data.limit,
    });
    if (!res.ok || !res.data) {
      throw new Error(res.error ?? "Failed to get relevant context");
    }
    const text = res.data
      .map(
        (item) =>
          `- [${item.domain}/${item.durability}] (${item.sourceFile} :: ${item.sectionPath.join(
            " > "
          )}) ${item.text}`
      )
      .join("\n");
    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  if (name === "explain_retrieval") {
    const parsed = GetRelevantContextParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for explain_retrieval");
    }
    const res = await memoryService.explainRelevantContext({
      query: parsed.data.query,
      domains: undefined,
      limit: parsed.data.limit,
    });
    if (!res.ok || !res.data) {
      throw new Error(res.error ?? "Failed to explain retrieval");
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res.data, null, 2),
        },
      ],
    };
  }

  if (name === "get_timeline") {
    const result = memoryService.getTimeline();
    if (!result.ok) throw new Error(result.error ?? "Failed to load timeline");
    return {
      content: [
        {
          type: "text",
          text: result.data,
        },
      ],
    };
  }

  if (name === "get_current_state") {
    const result = memoryService.getCurrentState();
    if (!result.ok) throw new Error(result.error ?? "Failed to load current state");
    return {
      content: [
        {
          type: "text",
          text: result.data,
        },
      ],
    };
  }

  if (name === "get_projects") {
    const result = memoryService.getProjects();
    if (!result.ok) throw new Error(result.error ?? "Failed to load projects");
    return {
      content: [
        {
          type: "text",
          text: result.data,
        },
      ],
    };
  }

  if (name === "get_creative_ideas") {
    const result = memoryService.getCreativeLab();
    if (!result.ok) throw new Error(result.error ?? "Failed to load creative lab");
    return {
      content: [
        {
          type: "text",
          text: result.data,
        },
      ],
    };
  }

  if (name === "ingest_memory") {
    const parsed = IngestMemoryParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for ingest_memory");
    }
    const res = memoryService.ingestMemory(parsed.data);
    if (!res.ok) throw new Error(res.error ?? "ingest_memory failed");
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res.data, null, 2),
        },
      ],
    };
  }

  if (name === "update_memory") {
    const parsed = UpdateMemoryParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for update_memory");
    }
    const res = memoryService.updateMemory(parsed.data);
    if (!res.ok) throw new Error(res.error ?? "update_memory failed");
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res.data, null, 2),
        },
      ],
    };
  }

  if (name === "detect_conflicts") {
    const res = memoryService.detectConflicts();
    if (!res.ok) throw new Error(res.error ?? "detect_conflicts failed");
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res.data, null, 2),
        },
      ],
    };
  }

  if (name === "memory_hygiene_report") {
    const res = memoryService.runHygiene(true);
    if (!res.ok || !res.data) {
      throw new Error(res.error ?? "memory_hygiene_report failed");
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res.data, null, 2),
        },
      ],
    };
  }

  if (name === "generate_reflection") {
    const parsed = GenerateReflectionParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for generate_reflection");
    }
    const res = memoryService.generateReflection(parsed.data.episodes);
    if (!res.ok || !res.data) {
      throw new Error(res.error ?? "generate_reflection failed");
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res.data, null, 2),
        },
      ],
    };
  }

  if (name === "verify_insight") {
    const parsed = VerifyInsightParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for verify_insight");
    }
    const episodes = parsed.data.episodes ?? [];
    const { summarizeEpisodes } = require("./reflection/summarizeEpisodes");
    const { patternDetection } = require("./reflection/patternDetection");
    const { verifyInsight } = require("./reflection/verifyInsight");
    const { runCounterfactualTest } = require("./reflection/counterfactualEngine");

    const summaries = summarizeEpisodes(episodes);
    const seedInsights = patternDetection(summaries);
    const baseInsight =
      seedInsights.find((ins: any) =>
        ins.text.toLowerCase().includes(parsed.data.insightText.toLowerCase())
      ) ??
      seedInsights[0] ??
      {
        text: parsed.data.insightText,
        category: "identity",
        confidence: 0.5,
        evidenceEpisodes: [],
        counterEvidenceEpisodes: [],
        contradictionCount: 0,
        createdAt: Date.now(),
        lastValidated: Date.now(),
        lastTested: Date.now(),
      };

    const verified = verifyInsight(baseInsight, summaries, [], {
      confidenceThreshold: 0.4,
    });
    const cf = runCounterfactualTest(verified, summaries, {
      confidenceThreshold: 0.4,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              confidence: cf.updatedInsight.confidence,
              supportingEpisodes: cf.updatedInsight.evidenceEpisodes,
              contradictions: verified.contradictionCount,
              verificationResult:
                cf.updatedInsight.confidence >= 0.4 ? "accepted" : "rejected",
              recommendedRewrite: cf.recommendedRewrite,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (name === "test_insight") {
    const parsed = TestInsightParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for test_insight");
    }
    const episodes = parsed.data.episodes ?? [];
    const { summarizeEpisodes } = require("./reflection/summarizeEpisodes");
    const { evidenceSearch } = require("./reflection/evidenceSearch");
    const summaries = summarizeEpisodes(episodes);
    const insightText = parsed.data.insightText;
    const counterText = `Not (${insightText})`;
    const stats = evidenceSearch(insightText, counterText, summaries);

    const raw = stats.supportingEvidence - stats.contradictingEvidence;
    const updatedConfidence = Math.max(0, Math.min(1, raw / 5));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              supportingEvidence: stats.supportingEvidence,
              contradictingEvidence: stats.contradictingEvidence,
              updatedConfidence,
              recommendedRewrite:
                updatedConfidence < 0.4
                  ? "Insight appears weakly supported; consider softening or discarding."
                  : undefined,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (name === "register_agent") {
    const parsed = RegisterAgentParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for register_agent");
    }
    const agent = agentRegistry.registerAgent(
      parsed.data.agentName,
      parsed.data.agentType
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ agentId: agent.id }, null, 2),
        },
      ],
    };
  }

  if (name === "agent_status") {
    const agents = agentRegistry.listAgents();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(agents, null, 2),
        },
      ],
    };
  }

  if (name === "agent_ingest_memory") {
    const parsed = AgentIngestMemoryParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for agent_ingest_memory");
    }
    const agent = agentRegistry.listAgents().find((a) => a.id === parsed.data.agentId);
    if (!agent) {
      throw new Error("Unknown agentId for agent_ingest_memory");
    }
    const res = memoryService.ingestMemory(parsed.data);
    if (!res.ok || !res.data) {
      throw new Error(res.error ?? "agent_ingest_memory failed");
    }
    const snapshot = await memoryService.getRelevantContext({
      query: parsed.data.content,
      limit: 1,
    });
    cognitionCoordinator.seed(snapshot.data ?? []);
    const target = (snapshot.data ?? [])[0];
    if (target) {
      cognitionCoordinator.applyOperation({
        agentId: parsed.data.agentId,
        action: "ingest_memory",
        targetMemoryId: target.id,
        payload: { text: target.text, tags: target.tags },
      });
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res.data, null, 2),
        },
      ],
    };
  }

  if (name === "agent_update_memory") {
    const parsed = AgentUpdateMemoryParams.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid arguments for agent_update_memory");
    }
    const agent = agentRegistry.listAgents().find((a) => a.id === parsed.data.agentId);
    if (!agent) {
      throw new Error("Unknown agentId for agent_update_memory");
    }
    const res = memoryService.updateMemory(parsed.data);
    if (!res.ok || !res.data) {
      throw new Error(res.error ?? "agent_update_memory failed");
    }
    const ctx = await memoryService.getRelevantContext({
      query: parsed.data.newContent,
      limit: 1,
    });
    cognitionCoordinator.seed(ctx.data ?? []);
    const target = (ctx.data ?? [])[0];
    if (target) {
      cognitionCoordinator.applyOperation({
        agentId: parsed.data.agentId,
        action: "update_memory",
        targetMemoryId: target.id,
        payload: { text: target.text, tags: target.tags },
      });
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(res.data, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
server.connect(transport);

