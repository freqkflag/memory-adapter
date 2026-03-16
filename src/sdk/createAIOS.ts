import * as memory from "../core/memory/index.js";
import * as retrieval from "../core/retrieval/index.js";
import * as reflection from "../core/reflection/index.js";
import * as prediction from "../core/prediction/index.js";
import * as emotion from "../core/emotion/index.js";
import * as planning from "../core/planning/index.js";
import * as cognition from "../core/cognition/index.js";
import { MemoryService } from "../memory/MemoryService.js";
import { AgentRegistry } from "../cognition/agentRegistry.js";
import { OperationLog } from "../cognition/operationLog.js";
import { ChangeBroadcast } from "../cognition/changeBroadcast.js";
import { CognitionCoordinator } from "../cognition/cognitionCoordinator.js";
import { PlannerAgent } from "../agents/plannerAgent.js";

export interface AIOS {
  memory: typeof memory;
  retrieval: typeof retrieval;
  reflection: typeof reflection;
  prediction: typeof prediction;
  emotion: typeof emotion;
  planner: {
    plannerAgent: PlannerAgent;
    planning: typeof planning;
  };
  cognition: {
    coordinator: CognitionCoordinator;
    core: typeof cognition;
  };
}

export async function createAIOS(): Promise<AIOS> {
  const memoryService = new MemoryService();
  await memoryService.loadAll("ai-os");

  const agents = new AgentRegistry();
  const opLog = new OperationLog();
  const broadcaster = new ChangeBroadcast();
  const coordinator = new CognitionCoordinator(memoryService, agents, opLog, broadcaster);
  const plannerAgent = new PlannerAgent(coordinator);

  return {
    memory,
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

