import { tokenize } from "../../utils/text.js";
export class HashEmbeddingProvider {
    embed(text) {
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
const defaultEmbeddingProvider = new HashEmbeddingProvider();
export function getDefaultEmbeddingProvider() {
    return defaultEmbeddingProvider;
}
