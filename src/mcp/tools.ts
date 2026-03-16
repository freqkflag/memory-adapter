import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { PlannerAgent } from "../agents/plannerAgent.js";
import { RetrieverAgent } from "../agents/retrieverAgent.js";
import { ReflectionAgent } from "../agents/reflectionAgent.js";
import { PredictionAgent } from "../agents/predictionAgent.js";
import { VerificationAgent } from "../agents/verificationAgent.js";
import { SystemIntrospectionAgent } from "../agents/systemIntrospectionAgent.js";

export function createTools(coordinator: CognitionCoordinator) {
  const planner = new PlannerAgent(coordinator);
  const retriever = new RetrieverAgent(coordinator);
  const reflection = new ReflectionAgent(coordinator);
  const prediction = new PredictionAgent(coordinator);
  const verification = new VerificationAgent(coordinator);
  const introspection = new SystemIntrospectionAgent(coordinator);

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
    }
  };
}

