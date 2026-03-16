import { runElangParserTests } from "../tests/elangParser.test";
import { runHybridSearchTests } from "../tests/hybridSearch.test";
import { runReflectionEngineTests } from "../tests/reflectionEngine.test";
import { runPredictionEngineTests } from "../tests/predictionEngine.test";
import { runConflictResolverTests } from "../tests/conflictResolver.test";
import { runSystemIntrospectionTests } from "../tests/systemIntrospectionAgent.test";
async function main() {
    runElangParserTests();
    runHybridSearchTests();
    runReflectionEngineTests();
    runPredictionEngineTests();
    runConflictResolverTests();
    await runSystemIntrospectionTests();
    // eslint-disable-next-line no-console
    console.log("All tests passed.");
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Tests failed", err);
    process.exit(1);
});
