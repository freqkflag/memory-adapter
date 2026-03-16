import { tokenize } from "../../utils/text.js";

export interface EmbeddingProvider {
  embed(text: string): number[];
}

export class HashEmbeddingProvider implements EmbeddingProvider {
  embed(text: string): number[] {
    const tokens = tokenize(text);
    const vec: number[] = [];
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

const defaultEmbeddingProvider: EmbeddingProvider = new HashEmbeddingProvider();

export function getDefaultEmbeddingProvider(): EmbeddingProvider {
  return defaultEmbeddingProvider;
}

