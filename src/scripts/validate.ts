import { MemoryService } from "../memory/MemoryService.js";
import { parseELang } from "../emotion/elangParser.js";
import { MemoryGraph } from "../graph/memoryGraph.js";
import { traverseGraph } from "../graph/graphTraversal.js";
import { hybridRetrieve } from "../search/hybridSearch.js";
import { generateReflections } from "../reflection/reflectionEngine.js";
import { generatePredictions, isPredictionActive } from "../prediction/predictionEngine.js";
import { resolveDuplicateWrites } from "../cognition/conflictResolver.js";
import { MemoryItem } from "../memory/MemoryItem.js";

async function run() {
  const memory = new MemoryService();
  await memory.loadAll("validator");
  const all = memory.getAll();

  // Memory parsing
  // eslint-disable-next-line no-console
  console.log("Memory items loaded:", all.length);

  // E-Lang parsing
  const elang = parseELang("valence:0.5, arousal:0.2 -> valence:0.6, arousal:0.3");
  // eslint-disable-next-line no-console
  console.log("E-Lang axes:", Object.keys(elang.axes));

  // Retrieval ranking and graph traversal
  const graph = MemoryGraph.buildFromMemories(all);
  const traversal = traverseGraph(graph, all.slice(0, 1).map((m) => m.id), 2);
  // eslint-disable-next-line no-console
  console.log("Graph traversal nodes:", traversal.length);

  const retrieval = hybridRetrieve("identity", all, graph);
  // eslint-disable-next-line no-console
  console.log("Hybrid retrieval results:", retrieval.length);

  // Reflection generation
  const reflections = generateReflections(all);
  // eslint-disable-next-line no-console
  console.log("Insights:", reflections.insights.length);

  // Prediction scoring
  const predictions = generatePredictions(all);
  const activeCount = predictions.filter(p => isPredictionActive(p)).length;
  // eslint-disable-next-line no-console
  console.log("Predictions (active):", activeCount);

  // Conflict resolution
  if (all.length >= 1) {
    const base: MemoryItem = { ...all[0] };
    const incoming: MemoryItem = { ...all[0], text: base.text + " (updated)" };
    const resolved = resolveDuplicateWrites(base, incoming);
    // eslint-disable-next-line no-console
    console.log("Conflict detected:", resolved.conflict);
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Validation failed", err);
  process.exit(1);
});

