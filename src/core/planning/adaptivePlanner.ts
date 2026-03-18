import type { ExecutionPlan } from "./dynamicPlanner.js";
import { generatePlan, executePlan } from "./dynamicPlanner.js";
import type { GoalMemory } from "../cognition/goalMemory.js";

export interface AdaptiveResult {
  goal: string;
  iterations: {
    plan: ExecutionPlan;
    results: any[];
    evaluation: {
      success: boolean;
      score: number;
      notes: string;
    };
  }[];
  finalResult: any;
}

function evaluateResults(goal: string, results: any[]) {
  const text = JSON.stringify(results).toLowerCase();

  let score = 0;

  if (text.includes("error")) score -= 1;
  if (text.includes("result")) score += 1;
  if (text.includes("summary")) score += 1;

  const success = score > 0;

  return {
    success,
    score,
    notes: success ? "Results appear relevant to goal" : "Results weak or incomplete"
  };
}

export async function runAdaptivePlan(
  goal: string,
  tools: Record<string, Function>,
  maxIterations = 3,
  goalMemory?: GoalMemory,
  goalId?: string
): Promise<AdaptiveResult> {
  const iterations: AdaptiveResult["iterations"] = [];
  let currentGoal = goal;
  let finalResult: any = null;

  const maxIters = Math.min(maxIterations, 3);

  for (let i = 0; i < maxIters; i++) {
    const plan = generatePlan(currentGoal);
    const results = await executePlan(plan, tools);
    const evaluation = evaluateResults(currentGoal, results);

    iterations.push({ plan, results, evaluation });

    if (goalMemory && goalId) {
      const existing = await goalMemory.get(goalId);
      const prevIterations = existing?.iterations ?? 0;
      await goalMemory.update(goalId, {
        iterations: prevIterations + 1,
        lastResult: results
      });
      if (evaluation.success) {
        await goalMemory.markComplete(goalId);
      }
    }

    if (evaluation.success) {
      finalResult = results;
      break;
    }

    currentGoal = `refine: ${goal}`;
  }

  return {
    goal,
    iterations,
    finalResult
  };
}

