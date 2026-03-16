"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTools = createTools;
const plannerAgent_1 = require("../agents/plannerAgent");
const retrieverAgent_1 = require("../agents/retrieverAgent");
const reflectionAgent_1 = require("../agents/reflectionAgent");
const predictionAgent_1 = require("../agents/predictionAgent");
const verificationAgent_1 = require("../agents/verificationAgent");
const systemIntrospectionAgent_1 = require("../agents/systemIntrospectionAgent");
function createTools(coordinator) {
    const planner = new plannerAgent_1.PlannerAgent(coordinator);
    const retriever = new retrieverAgent_1.RetrieverAgent(coordinator);
    const reflection = new reflectionAgent_1.ReflectionAgent(coordinator);
    const prediction = new predictionAgent_1.PredictionAgent(coordinator);
    const verification = new verificationAgent_1.VerificationAgent(coordinator);
    const introspection = new systemIntrospectionAgent_1.SystemIntrospectionAgent(coordinator);
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
