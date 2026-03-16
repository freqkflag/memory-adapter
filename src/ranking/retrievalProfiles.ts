export interface RetrievalProfile {
  maxResults: number;
  graphDepth: number;
  diversityPenalty: number;
}

export const DEFAULT_RETRIEVAL_PROFILE: RetrievalProfile = {
  maxResults: 12,
  graphDepth: 2,
  diversityPenalty: 0.15
};

