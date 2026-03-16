import { IntentAnalysis, MemoryDomain } from "../types";

function inferDomains(query: string): MemoryDomain[] {
  const q = query.toLowerCase();
  const domains = new Set<MemoryDomain>();

  if (/(who am i|identity|values|neurotype|communication)/.test(q)) {
    domains.add("identity");
  }
  if (/(timeline|history|when|past|milestone|earlier)/.test(q)) {
    domains.add("timeline");
  }
  if (/(current|right now|today|this week|support|energy|overwhelmed)/.test(q)) {
    domains.add("current_state");
  }
  if (/(project|budget app|tattoo skill|diy|task|next action)/.test(q)) {
    domains.add("projects");
  }
  if (/(idea|cosplay|tattoo|flash|halloween|horror|creative)/.test(q)) {
    domains.add("creative");
  }
  if (/(memory architecture|ai rules|how should you behave)/.test(q)) {
    domains.add("architecture");
  }

  if (domains.size === 0) {
    domains.add("current_state");
  }

  return Array.from(domains);
}

function extractTopics(query: string): string[] {
  const q = query.toLowerCase();
  const topics = new Set<string>();

  const topicWords = [
    "tattoo",
    "budget",
    "finance",
    "cosplay",
    "diy",
    "halloween",
    "horror",
    "energy",
    "support",
    "projects",
    "timeline",
    "identity",
  ];

  for (const word of topicWords) {
    if (q.includes(word)) topics.add(word);
  }

  return Array.from(topics);
}

function inferTimeframe(query: string): string | undefined {
  const q = query.toLowerCase();
  if (/(right now|today|this week|current)/.test(q)) return "present";
  if (/(tomorrow|next week|future|long-term)/.test(q)) return "future";
  if (/(past|used to|earlier|previously|before)/.test(q)) return "past";
  return undefined;
}

function inferImportance(query: string): number | undefined {
  const q = query.toLowerCase();
  if (/(urgent|critical|very important|high priority)/.test(q)) return 0.9;
  if (/(important|priority)/.test(q)) return 0.7;
  if (/(curious|wondering|just thinking)/.test(q)) return 0.3;
  return undefined;
}

export function analyzeIntent(query: string): IntentAnalysis {
  const trimmed = query.trim();
  const intent =
    /help|support|advice|guide/.test(trimmed.toLowerCase()) ?
      "support"
    : /plan|project|task|next step/.test(trimmed.toLowerCase()) ?
      "planning"
    : /remember|memory|context|history/.test(trimmed.toLowerCase()) ?
      "recall"
    : "general";

  const domains = inferDomains(trimmed);
  const topics = extractTopics(trimmed);
  const timeframe = inferTimeframe(trimmed);
  const importance = inferImportance(trimmed);

  return {
    intent,
    domains,
    topics,
    timeframe,
    importance,
  };
}

