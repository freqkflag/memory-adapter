import { detectSimplePatterns } from "./patternDetection.js";
import { verifyInsight } from "./verifyInsight.js";
import { generateCounterfactual } from "./counterfactualEngine.js";
export function generateReflections(episodes) {
    const nonReflectionEpisodes = episodes.filter((e) => e.domain !== "reflection");
    const patterns = detectSimplePatterns(nonReflectionEpisodes);
    const insights = [];
    const counterfactuals = [];
    for (const pattern of patterns) {
        const insight = verifyInsight(pattern, nonReflectionEpisodes);
        const cf = generateCounterfactual(insight);
        insights.push(insight);
        counterfactuals.push(cf);
    }
    return { insights, counterfactuals };
}
