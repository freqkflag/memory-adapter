"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elangParser_test_1 = require("../tests/elangParser.test");
const hybridSearch_test_1 = require("../tests/hybridSearch.test");
const reflectionEngine_test_1 = require("../tests/reflectionEngine.test");
const predictionEngine_test_1 = require("../tests/predictionEngine.test");
const conflictResolver_test_1 = require("../tests/conflictResolver.test");
const systemIntrospectionAgent_test_1 = require("../tests/systemIntrospectionAgent.test");
async function main() {
    (0, elangParser_test_1.runElangParserTests)();
    (0, hybridSearch_test_1.runHybridSearchTests)();
    (0, reflectionEngine_test_1.runReflectionEngineTests)();
    (0, predictionEngine_test_1.runPredictionEngineTests)();
    (0, conflictResolver_test_1.runConflictResolverTests)();
    await (0, systemIntrospectionAgent_test_1.runSystemIntrospectionTests)();
    // eslint-disable-next-line no-console
    console.log("All tests passed.");
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Tests failed", err);
    process.exit(1);
});
