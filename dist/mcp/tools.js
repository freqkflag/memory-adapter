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
import { goalMemory } from "../core/cognition/goalMemory.js";
import { GoalScheduler } from "../core/cognition/goalScheduler.js";
import { deriveSchedulerStateFromMemories } from "../core/cognition/schedulerState.js";
export const TOOL_DEFINITIONS = [
    {
        name: "list_tools",
        description: "List all available tools with metadata",
        capabilities: ["introspection"],
        domains: ["system"],
        inputSchema: z.object({}),
        async handler(_coordinator) {
            try {
                const { getToolManifest } = await import("./toolManifest.js");
                return getToolManifest();
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Unknown error";
                return { ok: false, error: message };
            }
        }
    },
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
        name: "adaptive_plan",
        description: "Execute a goal with adaptive planning, evaluation, and re-planning",
        capabilities: ["planning", "orchestration", "analysis"],
        domains: ["identity", "timeline", "projects", "emotion"],
        inputSchema: z.object({
            goal: z.string()
        }),
        async handler(coordinator, args) {
            const { goal } = args;
            const planner = new PlannerAgent(coordinator);
            const toolMap = {};
            for (const def of TOOL_DEFINITIONS) {
                if (def.name === "adaptive_plan")
                    continue;
                toolMap[def.name] = (a) => def.handler(coordinator, a ?? {});
            }
            return planner.adaptivePlan(goal, toolMap);
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
        name: "create_goal",
        description: "Create or reuse a long-running goal",
        capabilities: ["planning"],
        domains: ["identity", "timeline", "projects", "emotion"],
        inputSchema: z.object({ goal: z.string() }),
        async handler(_coordinator, args) {
            const { goal } = args;
            const existing = await goalMemory.findByText(goal);
            if (existing)
                return existing;
            const created = await goalMemory.add({ id: `goal-${Date.now()}`, goal });
            return created;
        }
    },
    {
        name: "resume_goal",
        description: "Resume an existing long-running goal using adaptive planning",
        capabilities: ["planning", "orchestration"],
        domains: ["identity", "timeline", "projects", "emotion"],
        inputSchema: z.object({ goalId: z.string() }),
        async handler(coordinator, args) {
            const { goalId } = args;
            const planner = new PlannerAgent(coordinator);
            const toolMap = {};
            for (const def of TOOL_DEFINITIONS) {
                if (def.name === "adaptive_plan" || def.name === "resume_goal")
                    continue;
                toolMap[def.name] = (a) => def.handler(coordinator, a ?? {});
            }
            return planner.resumeGoal(goalId, toolMap);
        }
    },
    {
        name: "list_goals",
        description: "List all known long-running goals",
        capabilities: ["introspection"],
        domains: ["projects", "identity", "timeline", "emotion"],
        inputSchema: z.object({}),
        async handler() {
            return goalMemory.listAll();
        }
    },
    {
        name: "complete_goal",
        description: "Mark an existing goal as completed",
        capabilities: ["planning"],
        domains: ["projects", "identity", "timeline", "emotion"],
        inputSchema: z.object({ goalId: z.string() }),
        async handler(_coordinator, args) {
            const { goalId } = args;
            const updated = await goalMemory.markComplete(goalId);
            if (!updated) {
                return { ok: false, error: "Goal not found" };
            }
            return updated;
        }
    },
    {
        name: "prioritize_goals",
        description: "Rank long-running goals by priority",
        capabilities: ["planning", "analysis"],
        domains: ["projects", "identity", "timeline", "emotion"],
        inputSchema: z.object({}),
        async handler() {
            const scheduler = new GoalScheduler();
            return scheduler.getPrioritizedGoals();
        }
    },
    {
        name: "get_scheduler_state",
        description: "Return current scheduler state from recent E-Lang vectors",
        capabilities: ["introspection", "analysis", "scheduling"],
        domains: ["emotion", "projects", "system"],
        inputSchema: z.object({}),
        async handler(coordinator) {
            const windowDays = 7;
            const maxSamples = 64;
            const state = deriveSchedulerStateFromMemories(coordinator.getAllMemories(), {
                windowDays,
                maxSamples,
                minSamples: 3
            });
            return {
                ...state,
                windowDays,
                maxSamples
            };
        }
    },
    {
        name: "get_next_goal",
        description: "Get the highest-priority runnable goal",
        capabilities: ["planning"],
        domains: ["projects", "identity", "timeline", "emotion"],
        inputSchema: z.object({}),
        async handler() {
            const scheduler = new GoalScheduler();
            return scheduler.getNextGoal();
        }
    },
    {
        name: "schedule_next_goal",
        description: "Schedule the next highest-priority goal",
        capabilities: ["planning", "orchestration"],
        domains: ["projects", "identity", "timeline", "emotion"],
        inputSchema: z.object({}),
        async handler(coordinator) {
            const scheduler = new GoalScheduler();
            const scheduled = await scheduler.scheduleNext();
            await coordinator.logOperation({
                agentId: "goal-scheduler",
                action: "schedule_next_goal",
                payload: scheduled
                    ? { goalId: scheduled.goal.id, scheduledAt: scheduled.scheduledAt }
                    : null
            });
            return scheduled;
        }
    },
    {
        name: "run_next_goal",
        description: "Run the highest-priority goal using adaptive planning",
        capabilities: ["planning", "orchestration"],
        domains: ["projects", "identity", "timeline", "emotion"],
        inputSchema: z.object({}),
        async handler(coordinator) {
            const scheduler = new GoalScheduler();
            const next = await scheduler.getNextGoal();
            await coordinator.logOperation({
                agentId: "goal-scheduler",
                action: "run_next_goal",
                payload: next ? { goalId: next.id } : null
            });
            if (!next) {
                return { ok: false, error: "No runnable goals" };
            }
            const planner = new PlannerAgent(coordinator);
            const toolMap = {};
            for (const def of TOOL_DEFINITIONS) {
                if (def.name === "run_next_goal" || def.name === "adaptive_plan")
                    continue;
                toolMap[def.name] = (a) => def.handler(coordinator, a ?? {});
            }
            return planner.resumeGoal(next.id, toolMap);
        }
    },
    {
        name: "update_goal",
        description: "Update scheduling/prioritization metadata for an existing goal",
        capabilities: ["planning", "analysis"],
        domains: ["projects", "identity", "timeline", "emotion"],
        inputSchema: z.object({
            goalId: z.string(),
            status: z.enum(["active", "paused", "completed", "failed"]).optional(),
            dueAt: z.number().optional(),
            importance: z.number().min(0).max(5).optional(),
            urgency: z.number().min(0).max(5).optional(),
            energyCost: z.number().min(0).max(5).optional(),
            focusCost: z.number().min(0).max(5).optional(),
            emotionalLoad: z.number().min(0).max(5).optional(),
            cognitiveLoad: z.number().min(0).max(5).optional()
        }),
        async handler(coordinator, args) {
            const input = args;
            const existing = await goalMemory.get(input.goalId);
            await coordinator.logOperation({
                agentId: "goal-scheduler",
                action: "update_goal",
                payload: input
            });
            if (!existing) {
                return { ok: false, error: "Goal not found" };
            }
            const updated = await goalMemory.update(input.goalId, {
                status: input.status,
                dueAt: input.dueAt,
                importance: input.importance,
                urgency: input.urgency,
                energyCost: input.energyCost,
                focusCost: input.focusCost,
                emotionalLoad: input.emotionalLoad,
                cognitiveLoad: input.cognitiveLoad
            });
            if (!updated) {
                return { ok: false, error: "Goal not found" };
            }
            return updated;
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
        name: "auto_plan",
        description: "Dynamically generate and execute a multi-step plan for a goal",
        capabilities: ["planning", "orchestration"],
        domains: ["identity", "timeline", "projects", "emotion"],
        inputSchema: z.object({ goal: z.string() }),
        async handler(coordinator, args) {
            const { goal } = args;
            const planner = new PlannerAgent(coordinator);
            const toolMap = {};
            for (const def of TOOL_DEFINITIONS) {
                if (def.name === "auto_plan")
                    continue;
                toolMap[def.name] = (a) => def.handler(coordinator, a ?? {});
            }
            return planner.autoPlan(goal, toolMap);
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
