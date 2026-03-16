export interface ELangVector {
  axes: Record<string, number>;
  timestamp: number;
  source: "user";
  trajectory?: ELangVector[];
}

