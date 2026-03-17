import { promises as fs } from "node:fs";
import { PatternCatalog } from "./patternCatalog.js";
const catalog = new PatternCatalog();
const OUTCOMES_PATH = "memory/prediction_outcomes.md";
export async function recordPredictionOutcome(predId, correct) {
    const now = Date.now();
    const stats = catalog.recordOutcome(predId, correct, now);
    const outcome = correct ? "correct" : "incorrect";
    const line = `- ${new Date(now).toISOString()} | predId=${predId} | outcome=${outcome} | total=${stats.total} ` +
        `correct=${stats.correct} incorrect=${stats.incorrect}\n`;
    await fs.mkdir("memory", { recursive: true });
    await fs.appendFile(OUTCOMES_PATH, line, "utf8");
}
export function getPatternCatalog() {
    return catalog;
}
