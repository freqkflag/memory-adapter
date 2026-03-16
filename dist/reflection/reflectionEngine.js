"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReflections = generateReflections;
const patternDetection_1 = require("./patternDetection");
const verifyInsight_1 = require("./verifyInsight");
const counterfactualEngine_1 = require("./counterfactualEngine");
function generateReflections(episodes) {
    const nonReflectionEpisodes = episodes.filter((e) => e.domain !== "reflection");
    const patterns = (0, patternDetection_1.detectSimplePatterns)(nonReflectionEpisodes);
    const insights = [];
    const counterfactuals = [];
    for (const pattern of patterns) {
        const insight = (0, verifyInsight_1.verifyInsight)(pattern, nonReflectionEpisodes);
        const cf = (0, counterfactualEngine_1.generateCounterfactual)(insight);
        insights.push(insight);
        counterfactuals.push(cf);
    }
    return { insights, counterfactuals };
}
