import { decomposeGoal } from "../planning/taskPlanner.js";
export class PlannerAgent {
    coordinator;
    id = "planner";
    name = "Planner Agent";
    type = "plannerAgent";
    constructor(coordinator) {
        this.coordinator = coordinator;
    }
    async plan(goal) {
        const task = decomposeGoal(goal, [
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
