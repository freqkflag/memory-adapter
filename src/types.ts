export type MemoryDomain =
  | "identity"
  | "timeline"
  | "current_state"
  | "projects"
  | "creative"
  | "architecture";

export type MemoryDurability =
  | "stable"
  | "semi_stable"
  | "dynamic"
  | "historical";

export interface MemoryItem {
  id: string;
  domain: MemoryDomain;
  durability: MemoryDurability;
  sectionPath: string[];
  text: string;
  tags: string[];
  sourceFile: string;
  line?: number;
  firstSeen?: string;
  lastUpdated?: string;
  importance: number;
  accessCount: number;
  lastAccessed?: number;
  strength?: number;
  archived?: boolean;
  version?: number;
  createdBy?: string;
  updatedBy?: string;
  lastOperationId?: string;
  conflictGroupKey?: string;
  embedding?: number[];
}

export interface IntentAnalysis {
  intent: string;
  domains: MemoryDomain[];
  topics: string[];
  timeframe?: string;
  importance?: number;
}

export interface Episode {
  id: string;
  text: string;
  timestamp: number;
  tags?: string[];
}

export interface Insight {
  text: string;
  category: string;
  confidence: number;
  evidenceEpisodes: string[];
  counterEvidenceEpisodes: string[];
  contradictionCount: number;
  createdAt: number;
  lastValidated: number;
  lastTested: number;
}

export interface ToolResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

