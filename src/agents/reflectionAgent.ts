import { MemoryItem } from "../memory/MemoryItem";
import { generateReflections, ReflectionResult } from "../reflection/reflectionEngine";

export class ReflectionAgent {
  readonly id = "reflectionAgent";
  readonly name = "Reflection Agent";
  readonly type = "reflectionAgent";

  reflect(episodes: MemoryItem[]): ReflectionResult {
    return generateReflections(episodes);
  }
}

