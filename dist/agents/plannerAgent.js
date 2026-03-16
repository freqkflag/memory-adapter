"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannerAgent = void 0;
const taskPlanner_1 = require("../planning/taskPlanner");
class PlannerAgent {
    constructor(coordinator) {
        this.coordinator = coordinator;
        this.id = "planner";
        this.name = "Planner Agent";
        this.type = "plannerAgent";
    }
    async plan(goal) {
        const task = (0, taskPlanner_1.decomposeGoal)(goal, [
            "retrieverAgent",
            "writerAgent",
            "reflectionAgent",
            "predictionAgent",
            "verificationAgent",
            "systemIntrospectionAgent"
        ]);
        await this.coordinator.logOperation({
            agentId: this.id,
            action: "create_plan",
            payload: { goal, task }
        });
        return task;
    }
}
exports.PlannerAgent = PlannerAgent;
