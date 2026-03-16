import { generateId } from "../utils/ids.js";
export function createRootTask(goal) {
    return {
        id: generateId("task"),
        goal,
        subtasks: [],
        status: "pending"
    };
}
export function decomposeGoal(goal, roles) {
    const root = createRootTask(goal);
    root.subtasks = roles.map((role) => ({
        id: generateId("task"),
        goal: `${goal} (${role})`,
        subtasks: [],
        assignedAgent: role,
        status: "pending"
    }));
    return root;
}
