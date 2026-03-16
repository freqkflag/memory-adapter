import { PlannerAgent } from "../agents/plannerAgent";
import { RetrieverAgent } from "../agents/retrieverAgent";
import { ReflectionAgent } from "../agents/reflectionAgent";
import { PredictionAgent } from "../agents/predictionAgent";
import { VerificationAgent } from "../agents/verificationAgent";
import { SystemIntrospectionAgent } from "../agents/systemIntrospectionAgent";
export function createTools(coordinator) {
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
        async get_relevant_context(input) {
            const results = await retriever.retrieve(input.query);
            return results.map((r) => ({ id: r.item.id, text: r.item.text, score: r.score }));
        },
        async generate_reflection() {
            return reflection.reflect();
        },
        async generate_predictions() {
            return prediction.predict();
        },
        async register_agent(input) {
            await coordinator.logOperation({
                agentId: input.id,
                action: "register_agent",
                payload: input
            });
            return { ok: true };
        },
        async test_insight(input) {
            return verification.testInsight(input.text);
        },
        async create_task(input) {
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
