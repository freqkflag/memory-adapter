## Personal AI Operating System

This repository implements a Personal AI Operating System with persistent markdown memory, hybrid retrieval, reflection and prediction engines, E-Lang emotional vectors, and a shared multi-agent cognition layer.

### Running the system

- **Install dependencies**

```bash
npm install
```

- **Type-check and build**

```bash
npm run build
```

- **Run validation script**

```bash
npm run validate
```

- **Run unit tests**

```bash
npm test
```

- **Start MCP server (HTTP)**

```bash
npm start
```

The server listens on `http://localhost:7070/mcp`. Send JSON payloads like:

```json
{ "tool": "get_relevant_context", "params": { "query": "identity" } }
```

### Memory model

All persistent memory is stored as **human-readable markdown** in the `memory/` directory:

- `identity_core.md` – identity and self-model.
- `life_timeline.md` – timeline of life events.
- `current_state.md` – current context and constraints.
- `creative_lab.md` – creative explorations and ideas.
- `project_tracker.md` – project-related traces.
- `reflections.md` – human-authored reflections.
- `predictions.md` – prediction log.
- `emotional_vectors.md` – E-Lang emotional vectors (no labels, vectors only).
- `operations.log` – JSONL operation log (one JSON object per line).

### E-Lang emotional vectors

E-Lang is a **formal, pre-linguistic representation** of emotional experience. It encodes multidimensional numeric vectors and optional trajectories, without attaching emotional labels.

- **Core rule**: **Representation ≠ Interpretation**.
  - E-Lang files store **numeric structure only**.
  - AI agents may *interpret* these vectors but must **not overwrite or relabel** them.

#### Syntax

The parser accepts expressions of the form:

```text
valence:0.5, arousal:0.2 -> valence:0.6, arousal:0.3
```

- Left side is the **current vector**.
- `->` introduces a **trajectory** made of additional vectors (optionally separated by `|`).
- Each axis is `axis-name:number` where axis names are drawn from the **AXIS_KEY registry** in `src/emotion/axisRegistry.ts`.

#### Storage

Write E-Lang expressions into `memory/emotional_vectors.md` as plain text under headings of your choice. The system parses these expressions into `ELangVector` objects when needed, preserving the numeric representation.

### MCP tools

The MCP server exposes:

- `get_user_summary` – summary of agents and a small identity context sample.
- `get_relevant_context` – hybrid retrieval for a natural-language query.
- `generate_reflection` – runs the reflection engine to produce insights and counterfactuals.
- `generate_predictions` – generates time-bounded predictions from current memory.
- `register_agent` – registers an external agent in the operation log.
- `test_insight` – verifies an insight against evidence episodes.
- `create_task` – creates a multi-agent task plan.
- `agent_status` – returns registered agents.
- `system_report` – runs the System Introspection Agent to report on agent performance, memory growth, and prediction health.

# freqkflag Neon Repo Template

This repository defines the **standard neon README template** used across the freqkflag ecosystem.

## What this repo contains

- `templates/README_NEON.md`  
  The actual README template used for new repos. It includes placeholders:
  - `{{REPO_NAME}}`
  - `{{REPO_SLUG}}`
  - `{{OWNER}}`
  - `{{TAGLINE}}`
  - `{{SERVICE_TYPE}}`
  - `{{PHASE_STATUS}}`
  - `{{OVERVIEW}}`
  - `{{COMPONENT_1}}` … `{{COMPONENT_3}}`

- `scripts/freq-init.sh`  
  A helper script you can use (or adapt) to bootstrap a new repo locally from this template.

## Using this as a GitHub template

1. Go to **Settings → Template repository** and enable it.
2. When creating a new repo, click **"Use this template"**.
3. Optionally, also run `scripts/freq-init.sh` in new projects to fill placeholders automatically.

This repo should stay **small, stable, and easy to reason about**.
