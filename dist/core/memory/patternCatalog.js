export class PatternCatalog {
    patterns = new Map();
    recordOutcome(predId, correct, at = Date.now()) {
        const existing = this.patterns.get(predId) ??
            {
                id: predId,
                total: 0,
                correct: 0,
                incorrect: 0,
                lastOutcomeAt: null
            };
        const updated = {
            ...existing,
            total: existing.total + 1,
            correct: existing.correct + (correct ? 1 : 0),
            incorrect: existing.incorrect + (correct ? 0 : 1),
            lastOutcomeAt: at
        };
        this.patterns.set(predId, updated);
        return updated;
    }
    get(predId) {
        return this.patterns.get(predId);
    }
    all() {
        return Array.from(this.patterns.values());
    }
}
