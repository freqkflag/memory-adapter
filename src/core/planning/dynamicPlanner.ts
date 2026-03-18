import { selectTools } from "../cognition/toolSelector.js";

export interface PlanStep {
  toolName: string;
  args: any;
  purpose: string;
}

export interface ExecutionPlan {
  goal: string;
  steps: PlanStep[];
}

function inferCapability(goal: string): string | undefined {
  const g = goal.toLowerCase();
  if (g.includes("summarize") || g.includes("summary")) return "summary";
  if (g.includes("analyze") || g.includes("analysis")) return "analysis";
  if (g.includes("reflect") || g.includes("reflection")) return "reflection";
  if (g.includes("predict") || g.includes("forecast")) return "prediction";
  return undefined;
}

function inferDomain(goal: string): string | undefined {
  const g = goal.toLowerCase();
  if (g.includes("identity") || g.includes("self")) return "identity";
  if (g.includes("timeline") || g.includes("history")) return "timeline";
  if (g.includes("project")) return "projects";
  if (g.includes("emotion") || g.includes("mood") || g.includes("feeling")) return "emotion";
  return undefined;
}

export function generatePlan(goal: string): ExecutionPlan {
  const capability = inferCapability(goal);
  const domain = inferDomain(goal);

  const candidates = selectTools({ capability, domain });
  const steps: PlanStep[] = [];

  // Simple heuristic: choose up to 3 distinct tools in a reasonable order
  const orderedNames = [
    "get_relevant_context",
    "generate_reflection",
    "generate_predictions",
    "self_evaluate"
  ];

  for (const name of orderedNames) {
    const tool = candidates.find((t) => t.name === name);
    if (!tool) continue;

    if (steps.length >= 3) break;

    let args: any = {};
    let purpose = "";

    switch (tool.name) {
      case "get_relevant_context":
        args = { query: goal };
        purpose = "Retrieve relevant context for the goal.";
        break;
      case "generate_reflection":
        args =
          domain === "identity"
            ? { mode: "identityConsolidation" }
            : {};
        purpose = "Generate reflections and counterfactuals.";
        break;
      case "generate_predictions":
        args = {};
        purpose = "Generate predictions based on current state.";
        break;
      case "self_evaluate":
        args = {};
        purpose = "Compute a self-evaluation health snapshot.";
        break;
      default:
        args = {};
        purpose = `Invoke tool ${tool.name} for the goal.`;
    }

    steps.push({
      toolName: tool.name,
      args,
      purpose
    });
  }

  return {
    goal,
    steps
  };
}

export async function executePlan(plan: ExecutionPlan, tools: any) {
  const results: { step: string; result: any }[] = [];

  for (const step of plan.steps) {
    const tool = tools[step.toolName];
    if (!tool) continue;

    const result = await tool(step.args || {});
    results.push({
      step: step.toolName,
      result
    });
  }

  return results;
}

