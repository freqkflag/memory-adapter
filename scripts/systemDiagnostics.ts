import { MemoryService } from "../src/memory/MemoryService";
import { MemoryGraph } from "../src/graph/memoryGraph";
import { traverseGraph } from "../src/graph/graphTraversal";
import { generatePredictions } from "../src/prediction/predictionEngine";
import { generateReflections } from "../src/reflection/reflectionEngine";

async function runDiagnostics() {
  const memoryService = new MemoryService();
  await memoryService.loadDomain("identity", "diagnostics");
  await memoryService.loadDomain("timeline", "diagnostics");
  await memoryService.loadDomain("current-state", "diagnostics");
  await memoryService.loadDomain("creative", "diagnostics");
  await memoryService.loadDomain("projects", "diagnostics");

  const all = memoryService.getAll();

  const totalMemories = all.length;
  const byDomain = new Map<string, number>();
  for (const m of all) {
    byDomain.set(m.domain, (byDomain.get(m.domain) ?? 0) + 1);
  }

  const graph = new MemoryGraph();
  for (let i = 0; i < all.length - 1; i++) {
    graph.addEdge({ from: all[i].id, to: all[i + 1].id, type: "related_to" });
  }
  const graphSample = all.slice(0, 1).map((m) => m.id);
  const reachable = graphSample.length ? traverseGraph(graph, graphSample, 3) : [];

  const reflections = generateReflections(all);
  const predictions = generatePredictions(all);

  const report = {
    memoryStats: {
      total: totalMemories,
      byDomain: Object.fromEntries(byDomain.entries())
    },
    graphStats: {
      nodes: totalMemories,
      reachableSample: reachable.length
    },
    reflectionStats: {
      insightCount: reflections.insights.length
    },
    predictionStats: {
      count: predictions.length
    }
  };

  // Deterministic JSON output
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(report, null, 2));
}

runDiagnostics().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Diagnostics failed:", err);
  process.exitCode = 1;
});

