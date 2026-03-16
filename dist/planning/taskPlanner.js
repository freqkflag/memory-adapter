"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRootTask = createRootTask;
exports.decomposeGoal = decomposeGoal;
const ids_1 = require("../utils/ids");
function createRootTask(goal) {
    return {
        id: (0, ids_1.generateId)("task"),
        goal,
        subtasks: [],
        status: "pending"
    };
}
function decomposeGoal(goal, roles) {
    const root = createRootTask(goal);
    root.subtasks = roles.map((role) => ({
        id: (0, ids_1.generateId)("task"),
        goal: `${goal} (${role})`,
        subtasks: [],
        assignedAgent: role,
        status: "pending"
    }));
    return root;
}
