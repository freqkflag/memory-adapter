import { Insight } from "../reflection/reflectionEngine";
import { MemoryItem } from "../memory/MemoryItem";
import { verifyInsight } from "../reflection/verifyInsight";

export class VerificationAgent {
  readonly id = "verificationAgent";
  readonly name = "Verification Agent";
  readonly type = "verificationAgent";

  verify(insightText: string, episodes: MemoryItem[]): Insight {
    return verifyInsight(insightText, episodes);
  }
}

