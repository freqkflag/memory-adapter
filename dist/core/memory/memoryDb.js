import { MemoryGraph } from "../../graph/memoryGraph.js";
import { hybridRetrieve } from "../../search/hybridSearch.js";
import { normalizeText, tokenize } from "../../utils/text.js";
export class InMemoryDb {
    items = [];
    normalizedText = new Map();
    keywordIndex = new Map();
    embeddingIndex = new Map();
    graph = new MemoryGraph();
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
        this.embeddingIndex.set(item.id, this.embed(norm));
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
            this.embeddingIndex.set(item.id, this.embed(norm));
        }
        this.graph = MemoryGraph.buildFromMemories(this.items);
    }
    embed(text) {
        // Simple deterministic embedding mirroring vectorSearch behavior.
        const tokens = tokenize(text);
        const vec = [];
        for (const token of tokens) {
            let hash = 0;
            for (let i = 0; i < token.length; i++) {
                hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
            }
            vec.push(hash % 997);
        }
        return vec;
    }
}
