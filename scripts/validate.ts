import { MemoryService } from "../src/memory/MemoryService";
import { parseELang } from "../src/emotion/elangParser";
import { MemoryGraph } from "../src/graph/memoryGraph";
import { traverseGraph } from "../src/graph/graphTraversal";
import { rankAndFilter } from "../src/ranking/rankAndFilter";
import { DEFAULT_RETRIEVAL_PROFILE } from "../src/ranking/retrievalProfiles";
import { generateReflections } from "../src/reflection/reflectionEngine";
import { generatePredictions } from "../src/prediction/predictionEngine";
import { scorePrediction } from "../src/prediction/predictionScoring";
import { resolveDuplicateWrites } from "../src/cognition/conflictResolver";
import { generateId } from "../src/utils/ids";
import { startServer } from "../src/mcp/server";

async function main() {
  const memoryService = new MemoryService();
  await memoryService.loadDomain("identity", "validator");
  await memoryService.loadDomain("timeline", "validator");
  await memoryService.loadDomain("current-state", "validator");
  await memoryService.loadDomain("creative", "validator");
  await memoryService.loadDomain("projects", "validator");

  const allMemories = memoryService.getAll();
  console.log(`Loaded ${allMemories.length} memory items.`);

  const elang = parseELang("valence=0.4,arousal=0.7 -> valence=0.1,arousal=0.2");
  console.log("Parsed E-Lang vector with axes:", Object.keys(elang.axes));

  const graph = new MemoryGraph();
  if (allMemories.length >= 2) {
    graph.addEdge({
      from: allMemories[0].id,
      to: allMemories[1].id,
      type: "related_to"
    });
  }
  const visited = traverseGraph(
    graph,
    allMemories.slice(0, 1).map((m) => m.id),
    2
  );
  console.log("Graph traversal visited nodes:", visited.length);

  const ranked = rankAndFilter(
    "identity project",
    allMemories,
    { graph, profile: DEFAULT_RETRIEVAL_PROFILE }
  );
  console.log("Ranking produced items:", ranked.length);

  const reflections = generateReflections(allMemories);
  console.log("Reflection insights:", reflections.insights.length);

  const predictions = generatePredictions(allMemories);
  const scores = predictions.map(scorePrediction);
  console.log("Prediction scores:", scores);

  if (allMemories.length >= 2) {
    const conflict = resolveDuplicateWrites(allMemories[0], allMemories[1]);
    console.log("Conflict resolution type:", conflict.type);
  }

  startServer(7070);
  console.log("Local MCP-style server listening on http://localhost:7070/health");
  console.log("Validation run complete. Generated run id:", generateId("run"));
}

main().catch((err) => {
  console.error("Validation failed:", err);
  process.exitCode = 1;
});

