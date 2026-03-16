import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { PlannerAgent } from "../agents/plannerAgent.js";
import { RetrieverAgent } from "../agents/retrieverAgent.js";
import { ReflectionAgent } from "../agents/reflectionAgent.js";
import { PredictionAgent } from "../agents/predictionAgent.js";
import { VerificationAgent } from "../agents/verificationAgent.js";
import { SystemIntrospectionAgent } from "../agents/systemIntrospectionAgent.js";
import { WriterAgent } from "../agents/writerAgent.js";
import type { MemoryDomain } from "../memory/domains.js";

export function createTools(coordinator: CognitionCoordinator) {
  const planner = new PlannerAgent(coordinator);
  const retriever = new RetrieverAgent(coordinator);
  const reflection = new ReflectionAgent(coordinator);
  const prediction = new PredictionAgent(coordinator);
  const verification = new VerificationAgent(coordinator);
  const introspection = new SystemIntrospectionAgent(coordinator);
  const writer = new WriterAgent(
    coordinator.getMemoryService(),
    (coordinator as any)["db"],
    coordinator
  );

  return {
    async get_user_summary() {
      const agents = coordinator.listAgents();
      const context = await coordinator.retrieveContext("identity");
      return {
        agentCount: agents.length,
        contextSample: context.slice(0, 3).map((r) => r.item.text)
      };
    },
    async get_relevant_context(input: { query: string }) {
      const results = await retriever.retrieve(input.query);
      return results.map((r) => ({ id: r.item.id, text: r.item.text, score: r.score }));
    },
    async generate_reflection() {
      return reflection.reflect();
    },
    async generate_predictions() {
      return prediction.predict();
    },
    async register_agent(input: { id: string; name: string; type: string }) {
      await coordinator.logOperation({
        agentId: input.id,
        action: "register_agent",
        payload: input
      });
      return { ok: true };
    },
    async test_insight(input: { text: string }) {
      return verification.testInsight(input.text);
    },
    async create_task(input: { goal: string }) {
      const task = await planner.plan(input.goal);
      return task;
    },
    async agent_status() {
      return coordinator.listAgents();
    },
    async system_report() {
      return introspection.analyze();
    },
    async ingest_document_summary(input: { text: string; domain?: string; source?: string }) {
      const allowedDomains: MemoryDomain[] = [
        "identity",
        "timeline",
        "current_state",
        "creative",
        "projects",
        "reflection",
        "prediction",
        "emotion"
      ];
      const requested = (input.domain ?? "timeline") as MemoryDomain;
      const domain: MemoryDomain = allowedDomains.includes(requested) ? requested : "timeline";
      const item = await writer.write(domain, input.text);
      await coordinator.logOperation({
        agentId: "ingest-document-summary",
        action: "ingest_document_summary",
        targetMemoryId: item.id,
        payload: { source: input.source, domain }
      });
      return item;
    }
  };
}

