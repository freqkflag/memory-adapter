import { MemoryGraph } from "../../graph/memoryGraph.js";
import { hybridRetrieve } from "../../search/hybridSearch.js";
import { normalizeText, tokenize } from "../../utils/text.js";
import { getDefaultEmbeddingProvider } from "../retrieval/embeddingProvider.js";
export class InMemoryDb {
    embeddingProvider;
    items = [];
    normalizedText = new Map();
    keywordIndex = new Map();
    embeddingIndex = new Map();
    graph = new MemoryGraph();
    constructor(embeddingProvider = getDefaultEmbeddingProvider()) {
        this.embeddingProvider = embeddingProvider;
    }
    initialize(items) {
        this.items = [...items];
        this.rebuildIndexes();
    }
    getAll() {
        return [...this.items];
    }
    getByDomain(domain) {
        return this.items.filter((m) => m.domain === domain);
    }
    add(item) {
        this.items.push(item);
        const norm = normalizeText(item.text);
        this.normalizedText.set(item.id, norm);
        this.keywordIndex.set(item.id, tokenize(norm));
        this.embeddingIndex.set(item.id, this.embeddingProvider.embed(norm));
        this.graph = MemoryGraph.buildFromMemories(this.items);
    }
    search(query, limit = 20) {
        if (this.items.length === 0)
            return [];
        const config = {
            topKVector: this.items.length,
            topKKeyword: this.items.length,
            graphDepth: 2,
            limit
        };
        return hybridRetrieve(query, this.items, this.graph, config);
    }
    rebuildIndexes() {
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
