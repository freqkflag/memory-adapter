export interface PatternStats {
  id: string;
  total: number;
  correct: number;
  incorrect: number;
  lastOutcomeAt: number | null;
}

export class PatternCatalog {
  private patterns = new Map<string, PatternStats>();

  recordOutcome(predId: string, correct: boolean, at: number = Date.now()): PatternStats {
    const existing =
      this.patterns.get(predId) ??
      {
        id: predId,
        total: 0,
        correct: 0,
        incorrect: 0,
        lastOutcomeAt: null
      };

    const updated: PatternStats = {
      ...existing,
      total: existing.total + 1,
      correct: existing.correct + (correct ? 1 : 0),
      incorrect: existing.incorrect + (correct ? 0 : 1),
      lastOutcomeAt: at
    };

    this.patterns.set(predId, updated);
    return updated;
  }

  get(predId: string): PatternStats | undefined {
    return this.patterns.get(predId);
  }

  all(): PatternStats[] {
    return Array.from(this.patterns.values());
  }
}

