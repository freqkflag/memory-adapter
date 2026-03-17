import { z } from "zod";
import { PlannerAgent } from "../agents/plannerAgent.js";
import { RetrieverAgent } from "../agents/retrieverAgent.js";
import { ReflectionAgent } from "../agents/reflectionAgent.js";
import { PredictionAgent } from "../agents/predictionAgent.js";
import { VerificationAgent } from "../agents/verificationAgent.js";
import { SystemIntrospectionAgent } from "../agents/systemIntrospectionAgent.js";
import { WriterAgent } from "../agents/writerAgent.js";
import { recordPredictionOutcome } from "../core/memory/predictionOutcomes.js";
import { computeHealthSnapshot } from "../core/analytics/selfEvaluation.js";
export const TOOL_DEFINITIONS = [
    {
        name: "get_user_summary",
        description: "Summarize current user context and agents",
        capabilities: ["introspection", "summary"],
        domains: ["identity", "agents"],
        inputSchema: z.object({}),
        async handler(coordinator) {
            const agents = coordinator.listAgents();
            const context = await coordinator.retrieveContext("identity");
            return {
                agentCount: agents.length,
                contextSample: context.slice(0, 3).map((r) => r.item.text)
            };
        }
    },
    {
        name: "get_relevant_context",
        description: "Run hybrid retrieval for a natural-language query",
        capabilities: ["retrieval"],
        domains: ["identity", "timeline", "current_state", "projects", "reflection", "prediction", "emotion", "creative"],
        inputSchema: z.object({ query: z.string() }),
        async handler(coordinator, args) {
            const { query } = args;
            const retriever = new RetrieverAgent(coordinator);
            const results = await retriever.retrieve(query);
            return results.map((r) => ({ id: r.item.id, text: r.item.text, score: r.score }));
        }
    },
    {
        name: "generate_reflection",
        description: "Generate insights and counterfactuals from current memory",
        capabilities: ["reflection", "analysis"],
        domains: ["identity", "timeline", "projects", "reflection"],
        inputSchema: z.object({
            mode: z.enum(["identityConsolidation", "problemSolving", "timelineReview"]).optional()
        }),
        async handler(coordinator, args) {
            const { mode } = args;
            const reflection = new ReflectionAgent(coordinator);
            return reflection.reflect(mode);
        }
    },
    {
        name: "generate_predictions",
        description: "Generate predictive memories from current state",
        capabilities: ["prediction"],
        domains: ["prediction", "projects", "timeline"],
        inputSchema: z.object({}),
        async handler(coordinator) {
            const prediction = new PredictionAgent(coordinator);
            return prediction.predict();
        }
    },
    {
        name: "record_prediction_outcome",
        description: "Record whether a prediction was correct or incorrect",
        capabilities: ["feedback", "prediction"],
        domains: ["prediction"],
        inputSchema: z.object({
            predId: z.string(),
            correct: z.boolean()
        }),
        async handler(_coordinator, args) {
            const { predId, correct } = args;
            await recordPredictionOutcome(predId, correct);
            return { ok: true };
        }
    },
    {
        name: "register_agent",
        description: "Register an external agent with the cognition layer",
        capabilities: ["registry"],
        domains: ["agents"],
        inputSchema: z.object({
            id: z.string(),
            name: z.string(),
            type: z.string()
        }),
        async handler(coordinator, args) {
            const input = args;
            await coordinator.logOperation({
                agentId: input.id,
                action: "register_agent",
                payload: input
            });
            return { ok: true };
        }
    },
    {
        name: "test_insight",
        description: "Verify an insight against evidence episodes",
        capabilities: ["reflection", "verification"],
        domains: ["reflection", "timeline", "projects"],
        inputSchema: z.object({ text: z.string() }),
        async handler(coordinator, args) {
            const { text } = args;
            const verification = new VerificationAgent(coordinator);
            return verification.testInsight(text);
        }
    },
    {
        name: "create_task",
        description: "Create a multi-agent task plan",
        capabilities: ["planning"],
        domains: ["projects"],
        inputSchema: z.object({ goal: z.string() }),
        async handler(coordinator, args) {
            const { goal } = args;
            const planner = new PlannerAgent(coordinator);
            const task = await planner.plan(goal);
            return task;
        }
    },
    {
        name: "agent_status",
        description: "List registered agents",
        capabilities: ["registry", "introspection"],
        domains: ["agents"],
        inputSchema: z.object({}),
        async handler(coordinator) {
            return coordinator.listAgents();
        }
    },
    {
        name: "system_report",
        description: "Run system introspection and return metrics and alerts",
        capabilities: ["introspection", "monitoring"],
        domains: ["system"],
        inputSchema: z.object({}),
        async handler(coordinator) {
            const introspection = new SystemIntrospectionAgent(coordinator);
            return introspection.analyze();
        }
    },
    {
        name: "self_evaluate",
        description: "Return a unified self-evaluation health snapshot",
        capabilities: ["introspection", "analysis"],
        domains: ["memory", "emotion", "timeline"],
        inputSchema: z.object({}),
        async handler(coordinator) {
            return computeHealthSnapshot(coordinator);
        }
    },
    {
        name: "ingest_document_summary",
        description: "Ingest a document summary into markdown memory",
        capabilities: ["ingest", "writing"],
        domains: ["identity", "timeline", "current_state", "creative", "projects", "reflection", "prediction", "emotion"],
        inputSchema: z.object({
            text: z.string(),
            domain: z.string().optional(),
            source: z.string().optional()
        }),
        async handler(coordinator, args) {
            const { text, domain, source } = args;
            const writer = new WriterAgent(coordinator.getMemoryService(), coordinator["db"], coordinator);
            const allowedDomains = [
                "identity",
                "timeline",
                "current_state",
                "creative",
                "projects",
                "reflection",
                "prediction",
                "emotion"
            ];
            const requested = (domain ?? "timeline");
            const resolvedDomain = allowedDomains.includes(requested) ? requested : "timeline";
            const item = await writer.write(resolvedDomain, text);
            await coordinator.logOperation({
                agentId: "ingest-document-summary",
                action: "ingest_document_summary",
                targetMemoryId: item.id,
                payload: { source, domain: resolvedDomain }
            });
            return item;
        }
    }
];
export function createTools(coordinator) {
    const tools = {};
    for (const def of TOOL_DEFINITIONS) {
        tools[def.name] = (args) => def.handler(coordinator, args ?? {});
    }
    return tools;
}
