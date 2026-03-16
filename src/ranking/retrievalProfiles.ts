export interface RetrievalProfile {
  name: string;
  vectorWeight: number;
  keywordWeight: number;
  graphWeight: number;
  temporalWeight: number;
  durabilityWeight: number;
  strengthWeight: number;
  redundancyPenalty: number;
}

export const DEFAULT_PROFILE: RetrievalProfile = {
  name: "default",
  vectorWeight: 1.0,
  keywordWeight: 0.8,
  graphWeight: 0.7,
  temporalWeight: 0.5,
  durabilityWeight: 0.3,
  strengthWeight: 0.6,
  redundancyPenalty: 0.4
};

