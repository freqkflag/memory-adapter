import { MemoryItem } from "../memory/MemoryItem";
import { cosineSimilarity } from "../utils/text";

function embed(text: string): number[] {
  const normalized = text.toLowerCase();
  const features = ["project", "timeline", "current", "idea", "emotion", "reflection"];
  return features.map((f) => (normalized.includes(f) ? 1 : 0));
}

export interface VectorSearchResult {
  item: MemoryItem;
  similarity: number;
}

export function vectorSearch(
  query: string,
  items: MemoryItem[]
): VectorSearchResult[] {
  const queryVec = embed(query);
  return items
    .map((item) => {
      const sim = cosineSimilarity(queryVec, embed(item.text));
      return { item, similarity: sim };
    })
    .filter((r) => r.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity);
}

import { pipeline, env } from "@xenova/transformers";
import { MemoryItem } from "../types";

env.allowLocalModels = false;
env.useBrowserCache = false;

let embeddingPipelinePromise:
  | Promise<(text: string) => Promise<number[]>>
  | undefined;

async function getEmbeddingPipeline(): Promise<(text: string) => Promise<number[]>> {
  if (!embeddingPipelinePromise) {
    embeddingPipelinePromise = (async () => {
      try {
        const extractor = await pipeline(
          "feature-extraction",
          "sentence-transformers/all-MiniLM-L6-v2"
        );
        return async (text: string) => {
          const output = await extractor(text, {
            pooling: "mean",
            normalize: true,
          });
          const data = Array.from(output.data as Float32Array);
          return data;
        };
      } catch {
        return async (_text: string) => {
          return [];
        };
      }
    })();
  }
  return embeddingPipelinePromise;
}

export async function computeEmbeddings(
  items: MemoryItem[]
): Promise<MemoryItem[]> {
  if (items.length === 0) return items;
  const embed = await getEmbeddingPipeline();
  for (const item of items) {
    if (!item.embedding) {
      item.embedding = await embed(item.text);
    }
  }
  return items;
}

function dot(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < len; i++) s += a[i] * b[i];
  return s;
}

export async function vectorSearch(
  query: string,
  items: MemoryItem[],
  limit: number
): Promise<{ item: MemoryItem; score: number }[]> {
  if (items.length === 0) return [];
  const embed = await getEmbeddingPipeline();
  const queryEmbedding = await embed(query);

  if (!queryEmbedding.length) {
    return [];
  }

  const withEmbeddings = await computeEmbeddings(items);

  const scored = withEmbeddings.map((item) => {
    const sim =
      item.embedding && item.embedding.length === queryEmbedding.length
        ? dot(item.embedding, queryEmbedding)
        : 0;
    return { item, score: sim };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

