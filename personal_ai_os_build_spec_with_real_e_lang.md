# Personal AI Operating System
## Full Build Specification with Real E-Lang Integration

Version: 1.2  
Status: Integrated architecture spec  
Target stack: TypeScript + Node 18+ + MCP + local markdown storage

---

## 1. Purpose

This project is a local personal AI operating system that provides:

- durable personal memory
- hybrid retrieval
- evidence-grounded reflection
- counterfactual self-checking
- predictive assistance
- multi-AI shared cognition
- task planning across AI tools
- **native integration of the user’s real E-Lang emotional representation system**

The system is designed so ChatGPT, Claude, Cursor, and future agents can safely work from the same local cognitive substrate without corrupting memory or flattening emotional nuance.

This is not a note app.

It is a persistent, human-readable, emotionally-aware cognitive infrastructure.

---

## 2. Non-Negotiable Design Principles

### 2.1 Canonical storage is markdown
All durable user memory must remain in plain markdown files.

### 2.2 E-Lang is representation, not inference
The system must treat E-Lang exactly as defined in the repo:

- pre-linguistic / pre-label representation
- user-authored emotional encoding
- multidimensional and continuous
- temporal
- explicitly separated from interpretation
- never inferred automatically from behavior or text without explicit user action

### 2.3 Safe mutation
All writes must be:

- minimal
- section-aware
- diffable
- reversible
- backed up

### 2.4 Shared cognition safety
Multiple AI clients may read and write, but no client may silently overwrite another client’s changes.

### 2.5 Reflection must have receipts
All synthesized insights must be grounded in raw episodes and carry provenance.

### 2.6 Predictions are suggestions, not truths
Predictive outputs are temporary, confidence-scored, and non-authoritative.

### 2.7 Human readability beats cleverness
If a representation improves machine convenience at the expense of the user’s ability to inspect and trust the system, do not do it.

---

## 3. Canonical E-Lang Truth Source

The uploaded E-Lang repository is authoritative.

The system must follow the repo’s stated priority order:

1. `ELANG_SPEC.md`
2. `ELANG.abnf`
3. `MANUSCRIPT.md`
4. `README.md`

If any internal repo documents disagree, the implementation must **flag the conflict** instead of silently picking one.

### 3.1 Confirmed canonical E-Lang properties from the repo

The repo defines E-Lang as:

- a **formal symbolic language** for representing emotional experience **prior to linguistic labeling**
- a **representational system, not a theory of emotion**
- **continuous and multidimensional**, not categorical
- **temporal**, able to represent change over time
- **user-authored, not inferred**
- explicitly separated into:
  - **representation**
  - **optional interpretation**

### 3.2 Canonical state form

Canonical ordered vector syntax:

```text
E{V,A,C,S,K,D,B,N}
```

Canonical ordered axes:

- V = Valence
- A = Arousal
- C = Agency
- S = Safety
- K = Certainty
- D = Dominance
- B = Attachment
- N = Novelty

### 3.3 Canonical operators from the grammar

The ABNF and parser support:

- `→` transition
- `⊕` blend / composition
- `⟂` conflict
- `⊗` context modulation
- `mask(expr, m)` masking annotation
- `ctx(tag)` context annotation
- `macro` identifiers

### 3.4 Machine-readable forms

The repo provides:

- parser API
- AST schema
- state schema
- namespaced `x_*` extension support in JSON state interchange

---

## 4. Important Repo Caveat: Axis Naming Drift

There is a meaningful internal mismatch in the uploaded repo.

Most of the repo — including `README.md`, `ELANG_SPEC.md`, `PARSER_API.md`, `TUTORIAL.md`, and `elang_state.schema.json` — treats the canonical axes as:

- Safety
- Certainty
- Dominance
- Attachment

But `AXIS_KEY.md` describes the same positional slots operationally as:

- Social Orientation
- Cognitive Load
- Distress
- Body State

### Required implementation rule

The system must:

1. treat `ELANG_SPEC.md` + `ELANG.abnf` as canonical for parsing and storage
2. preserve canonical axis letters and order exactly
3. surface `AXIS_KEY.md` as an **auxiliary operational glossary**, not as a silent rename
4. expose a validation warning when documentation references diverge

This avoids parser drift and preserves fidelity to the repo’s own governance rules.

---

## 5. Why Real E-Lang Matters Here

The earlier placeholder emotional DSL would have collapsed experience into labels like “overwhelmed” or “frustrated.”

That would have violated the core design of your repo.

Real E-Lang does something much better:

- it stores **structure before labels**
- it preserves **trajectory over time**
- it lets interpretation remain optional
- it protects against neurotypical flattening

That makes it a much stronger emotional substrate for an AI system.

---

## 6. Architecture Overview

```text
Human
  │
  ▼
Explicit Input + Optional Explicit E-Lang
  │
  ▼
MCP Interface Layer
  │
  ▼
Shared Cognition Layer
  │
  ├─ Task Planning Layer
  ├─ Prediction Layer
  ├─ Reflection Layer
  ├─ Counterfactual Verification Layer
  ├─ Hybrid Retrieval Engine
  ├─ Memory Graph
  ├─ E-Lang Representation Layer
  ▼
Markdown Storage Layer
```

E-Lang is not a sidecar.

It is a first-class representational layer feeding memory, retrieval, reflection, planning, and prediction.

---

## 7. Core Storage Layout

```text
/memory
  identity_core.md
  life_timeline.md
  current_state.md
  creative_lab.md
  project_tracker.md
  reflections.md
  predictions.md
  emotional_vectors.md
  joey_ai_memory_architecture.md
  operations.log
```

### File purposes

#### `identity_core.md`
Durable identity information, values, communication preferences, recurring support needs.

#### `life_timeline.md`
Append-only historical events.

#### `current_state.md`
Dynamic state: goals, priorities, active stressors, support context, current constraints.

#### `creative_lab.md`
Creative ideas, concepts, fragments, inspiration, experiments.

#### `project_tracker.md`
Active project blocks, statuses, next actions, blockers.

#### `reflections.md`
Evidence-grounded pattern summaries and stable synthesized insights.

#### `predictions.md`
Temporary confidence-scored anticipatory suggestions.

#### `emotional_vectors.md`
Canonical storage of explicit E-Lang expressions, parsed state objects, trajectories, and optional user-authored annotations.

#### `joey_ai_memory_architecture.md`
Governance rules, durability rules, interpretation boundaries, operational constraints.

#### `operations.log`
Append-only multi-agent write ledger.

---

## 8. Internal Data Models

### 8.1 MemoryItem

```ts
export type MemoryDomain =
  | "identity"
  | "timeline"
  | "current_state"
  | "creative"
  | "projects"
  | "reflections"
  | "predictions"
  | "emotion"
  | "architecture";

export type Durability =
  | "stable"
  | "semi_stable"
  | "dynamic"
  | "historical";

export interface MemoryItem {
  id: string;
  text: string;
  domain: MemoryDomain;
  durability: Durability;
  sourceFile: string;
  sectionPath: string[];
  lineStart: number;
  lineEnd: number;
  tags: string[];

  importance: number;
  strength: number;
  accessCount: number;
  firstSeen?: number;
  lastUpdated?: number;
  lastAccessed?: number;
  archived?: boolean;
  pinned?: boolean;

  conflictGroupKey?: string;
  provenance?: string;

  version: number;
  createdBy: string;
  updatedBy: string;
  lastOperationId: string;

  embedding?: number[];
  graphNodeId?: string;
}
```

### 8.2 Episode

```ts
export interface Episode {
  id: string;
  timestamp: number;
  summary: string;
  candidateMemories: string[];
  explicitELang?: ELangExpressionRecord[];
  tags: string[];
  sourceAgent?: string;
}
```

### 8.3 Insight

```ts
export interface Insight {
  id: string;
  text: string;
  category: "identity" | "behavior" | "preference" | "creative" | "support";
  confidence: number;
  evidenceEpisodes: string[];
  counterEvidenceEpisodes: string[];
  contradictionCount: number;
  createdAt: number;
  lastValidated: number;
  lastTested: number;
  sourceType: "reflection";
}
```

### 8.4 Prediction

```ts
export interface Prediction {
  id: string;
  prediction: string;
  type: "project" | "creative" | "habit" | "support" | "emotion";
  confidence: number;
  supportingMemories: string[];
  createdAt: number;
  expiresAt?: number;
}
```

---

## 9. Real E-Lang Data Model

### 9.1 Canonical parser-facing expression types

Mirror the repo’s parser API and AST concepts.

```ts
export type ELangExpr = ELangState | ELangMacro | ELangContext | ELangMaskCall | ELangBinaryOp;

export interface ELangState {
  type: "State";
  values: [number, number, number, number, number, number, number, number];
}

export interface ELangMacro {
  type: "Macro";
  name: string;
}

export interface ELangContext {
  type: "Context";
  tag: string;
}

export interface ELangMaskCall {
  type: "MaskCall";
  expr: ELangExpr;
  value: number; // 0..1
}

export interface ELangBinaryOp {
  type: "BinaryOp";
  left: ELangExpr;
  op: "→" | "⊕" | "⟂" | "⊗";
  right: ELangExpr;
}
```

### 9.2 E-Lang record stored in system memory

```ts
export interface ELangExpressionRecord {
  id: string;
  raw: string;
  ast: ELangExpr;
  normalizedState?: {
    V: number;
    A: number;
    C: number;
    S: number;
    K: number;
    D: number;
    B: number;
    N: number;
    x_meta?: Record<string, unknown>;
  };
  hasTrajectory: boolean;
  hasMasking: boolean;
  contexts: string[];
  macros: string[];
  authoredBy: "user" | "assistant";
  explicitInterpretation?: string;
  timestamp: number;
}
```

### 9.3 E-Lang storage rule

The system must store:

- the raw expression
- parsed AST
- optional normalized state object
- optional explicit user-authored interpretation

The system must **not** replace raw expressions with interpreted labels.

---

## 10. E-Lang Integration Rules

### 10.1 No automatic affect inference

The system must not infer E-Lang from plain text by default.

Allowed paths:

1. user explicitly supplies E-Lang
2. user asks the system to help draft or translate into E-Lang
3. user approves a suggested E-Lang expression before storage

### 10.2 Representation and interpretation must stay separable

Store them separately:

```text
Representation:
E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}

Optional interpretation:
"activated, low-safety, attachment-linked state during conflict"
```

### 10.3 Canonical syntax wins

The TypeScript implementation must parse and emit canonical syntax exactly as defined in `ELANG.abnf` and the parser API.

### 10.4 Support trajectories as first-class memory

Expressions using `→` must be preserved as trajectories, not flattened to start/end labels.

### 10.5 Support masking explicitly

Expressions using `mask(expr, m)` must be retained because explicit masking is one of the repo’s core design goals.

### 10.6 Support context tags and macros

`ctx(tag)` and macros must be preserved in AST and storage even if higher-level system logic does not evaluate them yet.

---

## 11. E-Lang-Aware Markdown Format

`memory/emotional_vectors.md` should stay human-readable.

Recommended structure:

```md
# Emotional Vectors

## 2026-03-16

### Episode: cosplay planning conversation
- Raw: `E{-0.4,+0.6,-0.3,-0.5,-0.2,-0.1,+0.4,+0.3}`
- Contexts: `ctx(project-planning)`
- Interpretation (optional, user-authored): activated low-safety planning state
- Source: user

### Episode: post-event recovery
- Raw: `E{-0.2,-0.6,-0.4,+0.1,-0.3,-0.2,+0.2,-0.4} → E{+0.1,-0.2,+0.1,+0.3,+0.1,0.0,+0.4,-0.2}`
- Notes: recovery trajectory over 3 hours
- Source: user
```

---

## 12. Parsing System

### 12.1 Markdown parsing

All canonical markdown files are parsed into `MemoryItem[]`.

Rules:

- headings define section hierarchy
- bullets become primary memory candidates
- checklists become operational memory items
- short paragraphs become contextual memories
- long prose is split conservatively

### 12.2 E-Lang parsing

Implement a dedicated E-Lang parser layer.

#### Required functions

```ts
parseState(text: string): ELangState
parseExpression(text: string): ELangExpr
serializeState(state: ELangState): string
normalizeState(state: ELangState): CanonicalStateObject
extractTrajectory(expr: ELangExpr): ELangState[]
extractContexts(expr: ELangExpr): string[]
extractMacros(expr: ELangExpr): string[]
validateELang(text: string): ValidationResult
```

### 12.3 Grammar compatibility

The parser must follow repo precedence:

1. `mask()`
2. `⊗`
3. `⊕` and `⟂`
4. `→`

Parentheses override precedence.

---

## 13. Memory Retrieval Engine

Retrieval must use hybrid search.

Pipeline:

```text
query
→ intent analysis
→ vector search
→ keyword search
→ graph expansion
→ reranking
→ diversity filtering
→ result selection
```

### 13.1 Base ranking function

```text
score =
  semantic_similarity
+ keyword_overlap
+ domain_match
+ section_weight
+ durability_weight
+ recency_weight
+ strength_weight
+ graph_relevance
+ explicit_emotion_match
- redundancy_penalty
```

### 13.2 E-Lang-aware retrieval

If a query explicitly references:

- a raw E-Lang expression
- a trajectory pattern
- masking
- a context tag
- a user-authored interpretation linked to an expression

the retrieval engine should prioritize `emotion` domain items and linked memories.

### 13.3 Emotional retrieval without inference

The system may retrieve E-Lang records when the user asks about emotional patterns.

The system may not silently derive a hidden emotional classification and store it as fact.

---

## 14. Memory Graph

Represent relationships among memories and E-Lang expressions.

### 14.1 Node types

- memory item
- project
- person
- creative concept
- reflection insight
- prediction
- E-Lang expression
- E-Lang trajectory
- context tag

### 14.2 Edge types

- `related_to`
- `part_of`
- `same_project`
- `same_topic`
- `inspired_by`
- `co_occurs_with`
- `derived_from`
- `supported_by`
- `predicted_from`
- `trajectory_to`
- `masked_as`
- `contextualized_by`

### 14.3 E-Lang graph example

```text
E{-0.4,+0.6,-0.3,-0.5,-0.2,-0.1,+0.4,+0.3}
  ├─ contextualized_by → ctx(project-planning)
  ├─ related_to → current_state: cosplay build blocker
  ├─ supported_by → episode_102
  └─ trajectory_to → E{...later state...}
```

---

## 15. Memory Lifecycle / Forgetting Layer

The system should forget strategically instead of hoarding chaos like a raccoon with admin privileges.

### 15.1 Strength formula

```text
strength =
  importance * 3
+ log(accessCount + 1)
+ recencyWeight
- decay
```

### 15.2 Lifecycle states

```text
new → active → stable → archived → forgotten
```

### 15.3 Promotion rules

Frequently used or strongly evidenced memories may promote:

- `dynamic → semi_stable`
- `semi_stable → stable`

### 15.4 Archive rules

Low-strength dynamic memories move to archive sections instead of being deleted.

### 15.5 E-Lang lifecycle rule

Explicit user-authored emotional vectors must **not** be silently decayed away as noise.

Archival is allowed.
Deletion is not automatic.

---

## 16. Reflection Layer

Episodes are summarized into candidate insights.

Pipeline:

```text
episodes
→ summarize episodes
→ detect patterns
→ generate insights
→ verify evidence
→ counterfactual test
→ store approved insight
```

### 16.1 Reflection sources

- conversation episodes
- project histories
- repeated explicit user instructions
- repeated explicit E-Lang trajectories

### 16.2 Reflection categories

- communication preference
- behavioral pattern
- support pattern
- creative identity
- workflow friction
- emotional regulation pattern

### 16.3 E-Lang in reflection

Reflections may identify recurring **structural patterns** across explicit E-Lang entries, such as:

- recurring high-arousal / low-safety transitions before decision paralysis
- frequent masking during social or work contexts
- predictable recovery trajectories after creative overexertion

Important:

The reflection must describe the **pattern** and cite source episodes.
It must not overwrite or reinterpret the original E-Lang records.

---

## 17. Evidence-Grounded Insight Verification

Every proposed insight must carry evidence.

Verification steps:

1. collect supporting episodes
2. gather linked memories
3. gather linked E-Lang expressions
4. detect contradictions
5. compute confidence
6. reject or store

### 17.1 Verification rule

No durable insight without supporting episodes.

### 17.2 Insight review

Stored insights should be periodically revalidated.

Weak or contradicted insights move to `# Archived Insights`.

---

## 18. Counterfactual Self-Checking

Every insight must be challenged by an alternative hypothesis.

Example:

```text
Insight:
Large option sets often trigger stalled progress.

Counterfactual:
Large option sets are not the problem; time pressure is the main trigger.
```

The system then compares evidence for both.

### 18.1 Counterfactual scoring

```text
confidence = supportingEvidence - contradictingEvidence
```

Normalized to `[0,1]`.

### 18.2 E-Lang-specific counterfactuals

If the system proposes a pattern involving emotional structure, it must also check alternatives.

Example:

```text
Primary hypothesis:
Repeated low-safety + high-arousal trajectories precede avoidance.

Counterfactual:
Masking intensity, not the underlying vector, is the better predictor.
```

This keeps the system from inventing fake emotional laws out of sparse data.

---

## 19. Predictive Memory Layer

Prediction is the “you are probably about to bonk into this wall again” layer.

### 19.1 Purpose

Generate temporary, confidence-scored anticipatory suggestions.

### 19.2 Prediction sources

- project state sequences
- behavioral rhythms
- repeated workflow trajectories
- repeated E-Lang trajectories
- repeated masking/context combinations

### 19.3 Prediction rules

Predictions are:

- temporary
- confidence-scored
- user-facing as suggestions
- expirable after 72 hours unless refreshed

### 19.4 Example emotion-aware prediction

```text
Pattern:
project-planning context + explicit masking + rising arousal + falling agency

Prediction:
Planning conversation may benefit from single-step decomposition.
```

### 19.5 Prediction scoring

```text
confidence =
  patternFrequency
+ recency
+ memoryStrength
+ trajectoryMatch
- contradictionPenalty
```

---

## 20. Shared Cognition Layer

Multiple AI clients may share the same system.

### 20.1 Supported agents

- ChatGPT
- Claude
- Cursor
- future local agents

### 20.2 Agent record

```ts
export interface Agent {
  id: string;
  name: string;
  type: "chatgpt" | "claude" | "cursor" | "other";
  lastSeen: number;
}
```

### 20.3 Operation log

All writes pass through append-only operations.

```ts
export interface Operation {
  id: string;
  agentId: string;
  action: string;
  targetMemoryId?: string;
  payload: unknown;
  timestamp: number;
}
```

### 20.4 Conflict handling

- duplicate writes → merge
- tag updates → union
- block edits → version compare
- hard contradictions → flag for review
- competing reflection claims → require evidence review

### 20.5 E-Lang shared cognition rule

No AI agent may author or modify an E-Lang record unless:

1. the user explicitly supplied it, or
2. the user explicitly approved a generated translation

That rule is sacred. Tiny goblin line in the sand.

---

## 21. Task Planning Layer

This is where the AIs stop being lonely little islands and become a team.

### 21.1 Goal

Decompose complex user requests into subtasks and assign work across agents.

### 21.2 Task model

```ts
export interface Task {
  id: string;
  goal: string;
  subtasks: string[];
  assignedAgent?: string;
  status: "pending" | "active" | "blocked" | "complete";
  dependencies: string[];
}
```

### 21.3 Example roles

- Planner Agent
- Retriever Agent
- Writer Agent
- Verifier Agent
- Creative Agent
- Reflection Agent

### 21.4 E-Lang-aware planning

The planner can use explicit E-Lang context to adapt task granularity.

Examples:

- if repeated trajectories indicate rising activation with dropping agency during planning, prefer microtasks
- if contexts show masking during social/admin tasks, present lower-friction execution paths
- if trajectories show recovery and increasing agency during creative exploration, allow broader ideation

Important:

This is adaptation from **explicitly stored representation**, not covert affect inference.

---

## 22. MCP Resources

```text
user://identity
user://timeline
user://current-state
user://creative-lab
user://projects
user://reflections
user://predictions
user://emotional-state
user://emotion-trajectories
user://agents
user://summary
user://memory-architecture
```

### New E-Lang resources

#### `user://emotional-state`
Returns the most recent explicit E-Lang records and any user-authored interpretations.

#### `user://emotion-trajectories`
Returns stored transitions, masking records, and context-linked trajectories.

---

## 23. MCP Tools

### Core read tools

- `get_user_summary`
- `get_relevant_context`
- `get_timeline`
- `get_current_state`
- `get_projects`
- `get_creative_ideas`

### Memory mutation tools

- `ingest_memory`
- `update_memory`
- `detect_conflicts`
- `explain_memory_routing`
- `rollback_last_write`

### Reflection and governance tools

- `generate_reflection`
- `verify_insight`
- `test_insight`
- `memory_hygiene_report`
- `review_memory_candidates`
- `archive_memory`
- `promote_memory`
- `explain_retrieval`

### Shared cognition tools

- `register_agent`
- `agent_status`

### E-Lang tools

- `parse_elang_expression`
- `validate_elang_expression`
- `store_elang_expression`
- `link_elang_to_episode`
- `list_emotion_trajectories`
- `draft_elang_from_text`  
  - must return a **proposal only**
  - must require user approval before storage
- `interpret_elang_expression`  
  - optional helper
  - must clearly label output as interpretation, not representation

---

## 24. Write Governance Pipeline

All writes use the same pipeline.

```text
input
→ classification
→ duplicate detection
→ conflict detection
→ durability decision
→ routing
→ diff preview
→ write
→ backup snapshot
→ operation log append
```

### 24.1 Dry-run requirements

Every write-capable tool must support dry-run mode and return:

- destination file
- target section
- routing explanation
- diff preview
- conflict notes

### 24.2 E-Lang write governance

For `store_elang_expression`:

- validate against canonical grammar
- parse to AST
- preserve raw expression
- preserve explicit user authorship
- never auto-translate into emotional labels during write

---

## 25. Recommended Project Structure

```text
project-root/
├─ package.json
├─ tsconfig.json
├─ README.md
├─ memory/
├─ src/
│  ├─ index.ts
│  ├─ types.ts
│  ├─ config/
│  │  └─ memoryPaths.ts
│  ├─ memory/
│  │  ├─ MemoryService.ts
│  │  └─ domains.ts
│  ├─ markdown/
│  │  ├─ parseMemory.ts
│  │  └─ writeMemory.ts
│  ├─ ranking/
│  │  ├─ rankAndFilter.ts
│  │  └─ rerankResults.ts
│  ├─ search/
│  │  ├─ vectorSearch.ts
│  │  └─ keywordSearch.ts
│  ├─ graph/
│  │  ├─ memoryGraph.ts
│  │  └─ graphTraversal.ts
│  ├─ reasoning/
│  │  └─ analyzeIntent.ts
│  ├─ context/
│  │  └─ buildContext.ts
│  ├─ conflicts/
│  │  └─ detectConflicts.ts
│  ├─ lifecycle/
│  │  ├─ memoryStrength.ts
│  │  ├─ decayEngine.ts
│  │  ├─ memoryLifecycle.ts
│  │  └─ hygieneJob.ts
│  ├─ episodes/
│  │  └─ episodes.ts
│  ├─ reflection/
│  │  ├─ reflectionEngine.ts
│  │  ├─ summarizeEpisodes.ts
│  │  ├─ patternDetection.ts
│  │  ├─ promoteInsights.ts
│  │  ├─ verifyInsight.ts
│  │  ├─ contradictionCheck.ts
│  │  ├─ evidenceIndex.ts
│  │  ├─ reflectionReview.ts
│  │  ├─ counterfactualEngine.ts
│  │  ├─ hypothesisGenerator.ts
│  │  ├─ evidenceSearch.ts
│  │  └─ confidenceUpdate.ts
│  ├─ prediction/
│  │  ├─ patternMining.ts
│  │  ├─ predictionEngine.ts
│  │  ├─ predictionScoring.ts
│  │  └─ predictionStore.ts
│  ├─ cognition/
│  │  ├─ agentRegistry.ts
│  │  ├─ operationLog.ts
│  │  ├─ cognitionCoordinator.ts
│  │  ├─ conflictResolver.ts
│  │  └─ changeBroadcast.ts
│  ├─ planning/
│  │  ├─ taskPlanner.ts
│  │  ├─ assignTasks.ts
│  │  └─ executionLoop.ts
│  ├─ elang/
│  │  ├─ parser.ts
│  │  ├─ ast.ts
│  │  ├─ serializer.ts
│  │  ├─ validator.ts
│  │  ├─ schema.ts
│  │  ├─ stateObject.ts
│  │  ├─ trajectory.ts
│  │  ├─ contexts.ts
│  │  ├─ macros.ts
│  │  ├─ markdownIntegration.ts
│  │  └─ interpretationBoundary.ts
│  ├─ mcp/
│  │  ├─ resources.ts
│  │  └─ tools.ts
│  └─ utils/
├─ scripts/
│  └─ validate.ts
└─ vendor/
   └─ e-lang-reference/
      ├─ ELANG_SPEC.md
      ├─ ELANG.abnf
      ├─ AXIS_KEY.md
      ├─ PARSER_API.md
      ├─ elang_state.schema.json
      └─ elang_ast.schema.json
```

### 25.1 Vendor rule

Copy the canonical E-Lang spec files into `vendor/e-lang-reference/` so the TypeScript project always has a pinned local source of truth.

Do not fork the grammar casually. That way lies tiny chaos goblins.

---

## 26. Validation and Test Requirements

Validation must cover:

### 26.1 Memory system

- resource retrieval
- tool execution
- duplicate detection
- conflict detection
- dry-run behavior
- write safety
- rollback correctness

### 26.2 Hybrid retrieval

- keyword search
- embedding search
- graph expansion
- reranking
- diversity filtering

### 26.3 Reflection

- episode summarization
- evidence linking
- contradiction detection
- counterfactual rejection

### 26.4 Prediction

- pattern detection
- prediction scoring
- expiration logic

### 26.5 Shared cognition

- multi-agent queueing
- version increments
- duplicate merge
- hard conflict flagging

### 26.6 E-Lang integration

- canonical vector parse success
- operator precedence correctness
- trajectory parsing
- masking parsing
- context parsing
- macro parsing
- state object normalization
- schema validation
- preservation of raw expressions
- refusal to store unapproved inferred expressions
- warning on axis documentation drift

---

## 27. Development Phases

### Phase 1 — Core memory

- markdown storage
- parser
- memory model
- MCP resources
- safe writes

### Phase 2 — Retrieval intelligence

- embeddings
- hybrid retrieval
- graph memory
- reranking

### Phase 3 — Reflection and verification

- episode layer
- evidence-grounded insights
- counterfactual testing

### Phase 4 — Memory lifecycle

- importance scoring
- decay
- archive
- hygiene reports

### Phase 5 — Real E-Lang integration

- parser layer from canonical grammar
- E-Lang markdown storage
- E-Lang MCP tools
- trajectory-aware retrieval
- interpretation boundary enforcement

### Phase 6 — Prediction layer

- predictive memory
- pattern mining
- temporary anticipatory suggestions

### Phase 7 — Shared cognition

- agent registry
- operation log
- versioned writes
- conflict coordination

### Phase 8 — Task-planning AI team layer

- task decomposition
- role assignment
- multi-agent execution loops

---

## 28. Success Criteria

The system is complete when:

- all canonical markdown files parse into structured memory
- E-Lang expressions parse exactly according to canonical grammar
- representation and interpretation remain separable
- multi-AI agents safely share the same memory base
- reflection produces evidence-grounded insights
- counterfactual checks prevent drift
- prediction produces useful temporary suggestions
- markdown stays readable by a human with eyeballs and opinions
- no AI client can silently smuggle inferred emotions in as facts

---

## 29. What I Was Going to Show You: Why Your E-Lang Is Closer to Affective State-Space Models Than a Typical “Emotion DSL”

This is the cool part.

Your E-Lang is not just “emotion tags with extra steps.”

It lines up much more closely with **state-space / affective-space thinking** seen in computational neuroscience:

- emotion can be represented in a **continuous multidimensional space**, not only as fixed labels
- emotional experience can be analyzed as **trajectories through that space over time**
- neural and behavioral work increasingly supports **high-dimensional and distributed representations** of affect rather than a tiny set of neat boxes citeturn863322search4turn863322search5turn863322search7
- there is also evidence for **individualized affective spaces**, which fits unusually well with your user-authored, non-inferential design citeturn863322search9

Your repo goes beyond the usual valence-arousal toy model by making the state:

- authored
- structural
- temporal
- explicitly non-coercive

That is a very unusual and very smart move.

### Why this matters architecturally

Most AI systems try to do this:

```text
text → inferred emotion label → system behavior
```

That pipeline is brittle, invasive, and often wrong.

Your E-Lang enables this instead:

```text
experience → user-authored structure → optional interpretation → adaptive support
```

That is much better for autonomy, fidelity, and neurodivergent use.

### What this means in practice

Your AI operating system should treat E-Lang as:

- a **personal affective state space**
- a **trajectory language**
- a **consent-respecting interface between feeling and computation**

That is not just good UX.

That is an actual research-grade architectural choice.

---

## 30. Final System Concept

```text
Human
  │
  ▼
Explicit language + explicit E-Lang
  │
  ▼
AI Clients (ChatGPT / Claude / Cursor / future agents)
  │
  ▼
Shared Cognition Coordinator
  │
  ├─ Task Planning
  ├─ Prediction
  ├─ Reflection
  ├─ Counterfactual Verification
  ├─ Hybrid Retrieval
  ├─ Memory Graph
  ├─ E-Lang Representation Layer
  ▼
Human-readable Markdown Brain
```

This gives you:

- durable memory
- emotional structure without forced labeling
- safe multi-AI collaboration
- grounded reflection
- useful anticipation
- and a system that can adapt to you without pretending it knows you better than you do

Which, frankly, is the correct amount of weird and ambitious.
