import { MemoryService } from "../src/memory/MemoryService";
import path from "path";

async function main() {
  const baseDir = path.resolve(process.cwd());
  const service = new MemoryService(baseDir);

  console.log("== getUserSummary ==");
  const summary = service.getUserSummary();
  if (!summary.ok || !summary.data) {
    throw new Error(summary.error ?? "getUserSummary failed");
  }
  console.log(summary.data.split("\n").slice(0, 10).join("\n"));

  console.log("\n== getRelevantContext('tattoo') ==");
  const ctx = await service.getRelevantContext({ query: "tattoo", limit: 5 });
  if (!ctx.ok || !ctx.data) {
    throw new Error(ctx.error ?? "getRelevantContext failed");
  }
  ctx.data.forEach((item) => {
    console.log(
      `- [${item.domain}/${item.durability}] ${item.sourceFile} :: ${item.sectionPath.join(
        " > "
      )} :: ${item.text}`
    );
  });

  console.log("\n== explainRelevantContext('tattoo') ==");
  const explained = await service.explainRelevantContext({
    query: "tattoo",
    limit: 5,
  });
  if (!explained.ok || !explained.data) {
    throw new Error(explained.error ?? "explainRelevantContext failed");
  }
  console.log(
    JSON.stringify(
      {
        intent: explained.data.intent,
        firstResult: explained.data.results[0],
      },
      null,
      2
    )
  );

  console.log("\n== memory hygiene (dry-run) ==");
  const hygiene = service.runHygiene(true);
  if (!hygiene.ok || !hygiene.data) {
    throw new Error(hygiene.error ?? "runHygiene failed");
  }
  console.log(
    JSON.stringify(
      {
        archivedCount: hygiene.data.archived.length,
        promotedCount: hygiene.data.promoted.length,
        lowStrengthCount: hygiene.data.lowStrength.length,
        duplicatesMergedCount: hygiene.data.duplicatesMerged.length,
      },
      null,
      2
    )
  );

  console.log("\n== reflection engine (episodes sample) ==");
  const episodes = [
    {
      id: "ep1",
      text: "I felt overwhelmed by too many details and needed calm explanations.",
      timestamp: Date.now(),
    },
    {
      id: "ep2",
      text: "I was excited about new tattoo flash ideas and creative designs.",
      timestamp: Date.now(),
    },
    {
      id: "ep3",
      text: "I stressed about budget planning and money again.",
      timestamp: Date.now(),
    },
  ];
  const reflection = service.generateReflection(episodes);
  if (!reflection.ok || !reflection.data) {
    throw new Error(reflection.error ?? "generateReflection failed in validation");
  }
  console.log(
    JSON.stringify(
      {
        summariesCount: reflection.data.summaries.length,
        insightsCount: reflection.data.insights.length,
        promotedCount: reflection.data.promotedTexts.length,
      },
      null,
      2
    )
  );

  console.log("\n== cognition: agent registry and op log ==");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { AgentRegistry } = require("../src/cognition/agentRegistry");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { OperationLog } = require("../src/cognition/operationLog");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CognitionCoordinator } = require(
    "../src/cognition/cognitionCoordinator"
  );

  const registry = new AgentRegistry(baseDir);
  const a1 = registry.registerAgent("Test ChatGPT", "chatgpt");
  const a2 = registry.registerAgent("Test Claude", "claude");

  const opLog = new OperationLog(baseDir);
  const coordinator = new CognitionCoordinator(baseDir);

  const items = service["loadAll"]();
  if (items.length > 0) {
    const target = items[0];
    coordinator.seed([target]);
    coordinator.applyOperation({
      agentId: a1.id,
      action: "tag_update",
      targetMemoryId: target.id,
      payload: { tags: [...target.tags, "test-tag"] },
    });
    coordinator.applyOperation({
      agentId: a2.id,
      action: "text_edit",
      targetMemoryId: target.id,
      payload: { text: target.text },
    });
  }

  const tail = opLog.tail(5);
  console.log(
    JSON.stringify(
      {
        agentsRegistered: [a1.id, a2.id],
        opLogCount: tail.length,
      },
      null,
      2
    )
  );

  console.log("\nValidation completed successfully.");
}

main().catch((err) => {
  console.error("Validation script failed:", err);
  process.exit(1);
});

