import { detectSimplePatterns } from "./patternDetection";
import { verifyInsight } from "./verifyInsight";
import { generateCounterfactual } from "./counterfactualEngine";
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
