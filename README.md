## Joey Memory MCP Server

**Purpose:** Local MCP-compatible memory server that uses Joey's markdown files as the canonical long-term memory store. It exposes resources and tools for retrieval while keeping everything human-readable and easy to edit.

### Files Used as Canonical Memory

- `joey_ai_memory_architecture.md` – overall memory architecture, roles, and high-level identity/state.
- `identity_core.md` – core identity, cognitive traits, values, communication preferences.
- `life_timeline.md` – life phases, major discoveries, creative development, community roles.
- `current_state.md` – current projects, focus areas, support needs, energy profile, immediate goals.
- `creative_lab.md` – creative domains, templates, inspiration bank, idea parking lot.
- `project_tracker.md` – active projects, backlog, weekly review template, AI project rules.

### Project Setup

```bash
cd /Volumes/storage/Projects/memory-adapter
npm install
npm run build
```

### Running the MCP Server

The server speaks MCP over stdio. In most MCP-capable clients you will configure a command like:

```bash
node dist/index.js
```

For local development you can run:

```bash
npm run dev
```

### Exposed Resources

- `user://identity` – identity profile and communication preferences.
- `user://timeline` – life timeline and major milestones.
- `user://current-state` – current projects, focus areas, support needs, energy state, goals.
- `user://creative-lab` – creative lab content and ideas.
- `user://projects` – project tracker (active + backlog).
- `user://memory-architecture` – full memory architecture document.
- `user://summary` – brief operational summary synthesized from the above.

All resources are rendered as markdown and are backed directly by the corresponding files.

### Implemented Tools (Phase 1)

- `get_user_summary`
  - Input: `{ focus?: string }`
  - Output: concise markdown summary combining identity, current state, and projects.

- `get_relevant_context`
  - Input: `{ query: string, domains?: string[], limit?: number }`
  - Output: ranked list of matching memory items (domain, durability, source file, section path, text).

The ingestion/update/conflict tools (`ingest_memory`, `update_memory`, `detect_conflicts`) are planned but not yet implemented in this initial skeleton.

### How Retrieval Works (v1)

- Markdown files are parsed into in-memory `MemoryItem` objects:
  - Headings build a `sectionPath`.
  - Bullet lines under headings become items.
  - Each item has:
    - `domain` (identity, timeline, current_state, projects, creative, architecture)
    - `durability` (stable, semi_stable, dynamic, historical) inferred from file + section
    - basic tags inferred from content (e.g. `tattoo`, `finance`, `cosplay`)
- `get_user_summary`:
  - Pulls items from identity, current_state, and projects domains.
  - Returns a short markdown summary suitable for live AI use.
- `get_relevant_context`:
  - Uses simple keyword scoring plus domain/durability boosts.
  - Deduplicates near-identical items by normalized text.

Later phases add semantic search, better conflict detection, ingestion, and safe write-back.

### Validation Script

You can run a quick sanity check of the in-memory behavior without MCP wiring:

```bash
npm run validate
```

This will:

- Build a summary from the current markdown files.
- Fetch a small set of relevant context items for the query `"tattoo"`.

### Notes on Safety and Clean Markdown

- The server **does not modify any markdown files** in the current implementation.
- All memory is re-parsed from disk on each call, so manual edits are always respected.
- Future write-back features will:
  - Prefer small, localized edits.
  - Preserve existing headings and separators.
  - Avoid adding heavy machine-only annotations to the markdown.

