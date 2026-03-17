import { decomposeGoal } from "../planning/taskPlanner.js";
import { now } from "../utils/time.js";
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
        this.coordinator.registerTask({
            id: task.id,
            description: task.goal,
            status: task.status === "done" ? "completed" : task.status === "running" ? "in_progress" : "pending",
            createdAt: now(),
            domain: "projects"
        });
        return task;
    }
}
