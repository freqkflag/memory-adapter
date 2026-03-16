import { MemoryService } from "../memory/MemoryService.js";
import { MemoryGraph } from "../graph/memoryGraph.js";
import { generatePredictions } from "../prediction/predictionEngine.js";
import { generateReflections } from "../reflection/reflectionEngine.js";
import { OperationLog } from "../cognition/operationLog.js";

async function main() {
  const memory = new MemoryService();
  await memory.loadAll("diagnostics");
  const all = memory.getAll();

  const graph = MemoryGraph.buildFromMemories(all);
  const predictions = generatePredictions(all);
  const reflections = generateReflections(all);

  const opLog = new OperationLog();

  // Memory stats
  const memoryByDomain: Record<string, number> = {};
  for (const m of all) {
    memoryByDomain[m.domain] = (memoryByDomain[m.domain] ?? 0) + 1;
  }

  // Graph size
  let edgeCount = 0;
  for (const m of all) {
    edgeCount += graph.getNeighbors(m.id).length;
  }

  // Prediction accuracy proxy
  const avgPredictionConfidence =
    predictions.reduce((sum: number, p) => sum + p.confidence, 0) / (predictions.length || 1);

  // Reflection rate proxy
  const reflectionCount = reflections.insights.length;

  // Agent activity (based on operations log size)
  const fs = await import("fs/promises");
  let opLines = 0;
  try {
    const text = await fs.readFile("memory/operations.log", "utf8");
    opLines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean).length;
  } catch {
    opLines = 0;
  }

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        memoryStats: {
          total: all.length,
          byDomain: memoryByDomain
        },
        graphStats: {
          nodes: all.length,
          edges: edgeCount
        },
        predictionStats: {
          count: predictions.length,
          averageConfidence: avgPredictionConfidence
        },
        reflectionStats: {
          insightCount: reflectionCount
        },
        agentActivity: {
          operationCount: opLines
        }
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Diagnostics failed", err);
  process.exit(1);
});

