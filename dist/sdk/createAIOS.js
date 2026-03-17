import * as memory from "../core/memory/index.js";
import * as retrieval from "../core/retrieval/index.js";
import * as reflection from "../core/reflection/index.js";
import * as prediction from "../core/prediction/index.js";
import * as emotion from "../core/emotion/index.js";
import * as planning from "../core/planning/index.js";
import * as cognition from "../core/cognition/index.js";
import { MemoryService } from "../memory/MemoryService.js";
import { InMemoryDb } from "../core/memory/memoryDb.js";
import { AgentRegistry } from "../cognition/agentRegistry.js";
import { OperationLog } from "../cognition/operationLog.js";
import { ChangeBroadcast } from "../cognition/changeBroadcast.js";
import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { PlannerAgent } from "../agents/plannerAgent.js";
import { TaskMemory } from "../core/cognition/taskMemory.js";
export async function createAIOS() {
    const memoryService = new MemoryService();
    await memoryService.loadAll("ai-os");
    const db = new InMemoryDb();
    db.initialize(memoryService.getAll());
    const agents = new AgentRegistry();
    const opLog = new OperationLog();
    const broadcaster = new ChangeBroadcast();
    const taskMemory = new TaskMemory();
    const coordinator = new CognitionCoordinator(memoryService, db, agents, opLog, broadcaster, taskMemory);
    const plannerAgent = new PlannerAgent(coordinator);
    return {
        memory,
        db,
        retrieval,
        reflection,
        prediction,
        emotion,
        planner: {
            plannerAgent,
            planning
        },
        cognition: {
            coordinator,
            core: cognition
        }
    };
}
