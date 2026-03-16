import { MemoryService } from "../memory/MemoryService";
import { MemoryGraph } from "../graph/memoryGraph";
import { RetrieverAgent } from "../agents/retrieverAgent";
import { ReflectionAgent } from "../agents/reflectionAgent";
import { PredictionAgent } from "../agents/predictionAgent";
import { PlannerAgent } from "../agents/plannerAgent";
import { VerificationAgent } from "../agents/verificationAgent";
import { AgentRegistry, Agent } from "../cognition/agentRegistry";
import { CognitionCoordinator } from "../cognition/cognitionCoordinator";
import { ChangeBroadcast } from "../cognition/changeBroadcast";
import { Task } from "../planning/agentRoles";
import { generateReflections } from "../reflection/reflectionEngine";
import { generatePredictions } from "../prediction/predictionEngine";

export interface MCPContext {
  memoryService: MemoryService;
  graph: MemoryGraph;
  registry: AgentRegistry;
  coordinator: CognitionCoordinator;
}

export async function get_user_summary(ctx: MCPContext): Promise<string> {
  const items = ctx.memoryService.getAll();
  const identity = items.filter((m) => m.domain === "identity");
  const projects = items.filter((m) => m.domain === "projects");
  return [
    `Identity memories: ${identity.length}`,
    `Project memories: ${projects.length}`,
    `Total memories: ${items.length}`
  ].join("\n");
}

export async function get_relevant_context(
  ctx: MCPContext,
  query: string
): Promise<string[]> {
  const retriever = new RetrieverAgent(ctx.memoryService, ctx.graph);
  const results = await retriever.retrieve(query);
  return results.map((r) => r.text);
}

export async function generate_reflection(ctx: MCPContext): Promise<string[]> {
  const items = ctx.memoryService.getAll();
  const reflectionAgent = new ReflectionAgent();
  const result = reflectionAgent.reflect(items);
  return result.insights.map((i) => i.text);
}

export async function generate_predictions(ctx: MCPContext): Promise<string[]> {
  const items = ctx.memoryService.getAll();
  const predictionAgent = new PredictionAgent();
  const preds = predictionAgent.predict(items);
  return preds.map((p) => p.prediction);
}

export async function register_agent(
  ctx: MCPContext,
  agent: Agent
): Promise<void> {
  ctx.registry.register(agent);
}

export async function test_insight(
  ctx: MCPContext,
  insightText: string
): Promise<string> {
  const episodes = ctx.memoryService.getAll();
  const verificationAgent = new VerificationAgent();
  const verified = verificationAgent.verify(insightText, episodes);
  return `Insight "${verified.text}" confidence: ${verified.confidence.toFixed(
    2
  )}, contradictions: ${verified.contradictionCount}`;
}

export async function create_task(
  _ctx: MCPContext,
  goal: string
): Promise<Task> {
  const planner = new PlannerAgent();
  return planner.plan(goal);
}

export async function agent_status(ctx: MCPContext): Promise<Agent[]> {
  return ctx.registry.list();
}

export function createDefaultMCPContext(): MCPContext {
  const memoryService = new MemoryService();
  const graph = new MemoryGraph();
  const registry = new AgentRegistry();
  const broadcast = new ChangeBroadcast();
  const coordinator = new CognitionCoordinator(registry, broadcast);
  return { memoryService, graph, registry, coordinator };
}

