import { MemoryItem } from "../../memory/MemoryItem.js";
import { MemoryGraph } from "../../graph/memoryGraph.js";
import { hybridRetrieve, type HybridRetrievalConfig } from "../../search/hybridSearch.js";
import type { RankedResult } from "../../ranking/rankAndFilter.js";
import { normalizeText, tokenize } from "../../utils/text.js";
import {
  type EmbeddingProvider,
  getDefaultEmbeddingProvider
} from "../retrieval/embeddingProvider.js";

export interface MemoryDb {
  initialize(items: MemoryItem[]): void;
  getAll(): MemoryItem[];
  getByDomain(domain: string): MemoryItem[];
  add(item: MemoryItem): void;
  search(query: string, limit?: number): RankedResult[];
}

export class InMemoryDb implements MemoryDb {
  private items: MemoryItem[] = [];
  private normalizedText = new Map<string, string>();
  private keywordIndex = new Map<string, string[]>();
  private embeddingIndex = new Map<string, number[]>();
  private graph: MemoryGraph = new MemoryGraph();

  constructor(private readonly embeddingProvider: EmbeddingProvider = getDefaultEmbeddingProvider()) {}

  initialize(items: MemoryItem[]): void {
    this.items = [...items];
    this.rebuildIndexes();
  }

  getAll(): MemoryItem[] {
    return [...this.items];
  }

  getByDomain(domain: string): MemoryItem[] {
    return this.items.filter((m) => m.domain === domain);
  }

  add(item: MemoryItem): void {
    this.items.push(item);
    const norm = normalizeText(item.text);
    this.normalizedText.set(item.id, norm);
    this.keywordIndex.set(item.id, tokenize(norm));
    this.embeddingIndex.set(item.id, this.embeddingProvider.embed(norm));
    this.graph = MemoryGraph.buildFromMemories(this.items);
  }

  search(query: string, limit: number = 20): RankedResult[] {
    if (this.items.length === 0) return [];
    const config: HybridRetrievalConfig = {
      topKVector: this.items.length,
      topKKeyword: this.items.length,
      graphDepth: 2,
      limit
    };
    return hybridRetrieve(query, this.items, this.graph, config);
  }

  private rebuildIndexes(): void {
    this.normalizedText.clear();
    this.keywordIndex.clear();
    this.embeddingIndex.clear();
    for (const item of this.items) {
      const norm = normalizeText(item.text);
      this.normalizedText.set(item.id, norm);
      this.keywordIndex.set(item.id, tokenize(norm));
      this.embeddingIndex.set(item.id, this.embeddingProvider.embed(norm));
    }
    this.graph = MemoryGraph.buildFromMemories(this.items);
  }
}
