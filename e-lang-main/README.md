# E-Lang

**E-Lang** is a formal symbolic language for representing emotional experience prior to linguistic labeling.
It is designed to reduce neurotypical bias in emotional reporting and to support neurodivergent modes of sense-making, particularly for autistic and ADHD populations.

E-Lang treats emotion as structure, trajectory, and context, not as categorical labels.

## What This Is

E-Lang is:

- A representational system, not a theory of emotion
- Pre-verbal by design: emotions are encoded before naming
- Continuous and multidimensional, not categorical
- Temporal, capturing change over time
- User-authored, not inferred by external systems

It provides infrastructure for emotional communication, journaling, research, therapy-adjacent use, and ethical human-AI interaction.

## What This Is Not

E-Lang is not:

- A diagnostic tool
- A therapeutic protocol
- An emotion taxonomy
- A clinical assessment
- An automated emotion inference system

Interpretation is optional and explicitly separated from representation.

## Canonical Files

The repository root is the canonical reference for all specifications.

**Primary specifications:**
- [`ELANG_SPEC.md`](ELANG_SPEC.md) — Formal language specification (syntax, semantics, operators)
- [`ELANG.abnf`](ELANG.abnf) — ABNF grammar specification (parsing authority)

**Supporting files:**
- [`ELANG_MACROS.md`](ELANG_MACROS.md) — Reusable vector bundles and expression fragments
- [`JOURNAL_TEMPLATE.md`](JOURNAL_TEMPLATE.md) — Daily/weekly journaling template
- [`AGENTS.md`](AGENTS.md) — AI agent and contributor guidelines
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Contribution workflow and guidelines
- [`ROADMAP.md`](ROADMAP.md) — Planned evolution and version milestones

**Research materials:**
- [`MANUSCRIPT.md`](MANUSCRIPT.md) — Research manuscript
- [`METHODS_AUTOETHNOGRAPHY.md`](METHODS_AUTOETHNOGRAPHY.md) — Research protocol
- [`POSITIONALITY_STATEMENT.md`](POSITIONALITY_STATEMENT.md) — Researcher positionality
- [`ETHICAL_CONSIDERATIONS.md`](ETHICAL_CONSIDERATIONS.md) — Ethical boundaries and safeguards
- [`RESULTS.md`](RESULTS.md) — Exploratory study results
- [`DISCUSSION.md`](DISCUSSION.md) — Implications and interpretation
- [`LIMITATIONS_FUTURE_WORK.md`](LIMITATIONS_FUTURE_WORK.md) — Scope and next research steps
- [`ABSTRACT.md`](ABSTRACT.md) — Publication abstract
- [`COVER_LETTER.md`](COVER_LETTER.md) — Journal submission cover letter

**Testing and tooling:**
- [`tests/`](tests/) — Parser test suite specifications and fixtures
- [`PARSER_API.md`](PARSER_API.md) — Parser interface documentation
- [`elang_state.schema.json`](elang_state.schema.json) — JSON Schema for state interchange
- [`elang_ast.schema.json`](elang_ast.schema.json) — JSON Schema for AST serialization
- [`LICENSE`](LICENSE) — MIT License

## Core Concept

Instead of forcing experience into emotion words:

```
experience -> words -> meaning
```

E-Lang introduces a structural layer:

```
experience -> representation -> (optional) interpretation
```

Emotional states are encoded as vectors across eight continuous axes:

- Valence
- Arousal
- Agency
- Safety
- Certainty
- Dominance
- Attachment
- Novelty

Meaning emerges from configuration and change, not labels.

## Examples

### Basic State Vector

```
E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}
```

This encodes an activated, attachment-linked, low-safety state without naming it.

### Grammar Examples

**Masking** (explicit suppression of emotional expression):
```
mask(E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}, E{0.0,0.3,0.0,0.0,0.0,0.0,0.0,0.0})
```
Suppresses arousal by 30% to model masking behavior.

**Context Application**:
```
E{0.5,0.3,0.2,0.1,0.0,0.0,0.0,0.0} ⊗ ctx(workplace)
```
Applies workplace context modifiers to emotional state.

**Composition**:
```
E{0.5,0.3,0.0,0.0,0.0,0.0,0.0,0.0} ⊕ E{0.2,0.1,0.4,0.0,0.0,0.0,0.0,0.0}
```
Combines two simultaneous emotional experiences additively.

**Transition**:
```
E{-0.8,-0.6,-0.4,-0.7,0.0,0.0,0.0,0.0} → E{-0.2,0.1,0.3,0.2,0.0,0.0,0.0,0.0}
```
Represents temporal change from one emotional state to another.

See `ELANG_SPEC.md` for complete grammar and operator definitions.

## Getting Started

**New to E-Lang?**
- [`TUTORIAL.md`](TUTORIAL.md) — First-time user guide with examples
- [`JOURNAL_TEMPLATE.md`](JOURNAL_TEMPLATE.md) — Daily/weekly journaling template

**Building tools?**
- [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md) — Parser usage, AST handling, validation
- [`PARSER_API.md`](PARSER_API.md) — Complete parser interface reference
- [`elang_state.schema.json`](elang_state.schema.json) — JSON Schema for state validation
- [`elang_ast.schema.json`](elang_ast.schema.json) — JSON Schema for AST serialization

**Extending E-Lang?**
- [`EXTENSIONS.md`](EXTENSIONS.md) — Safe extension practices and guidelines

## Versioning

- **v0.2** — Grammar-complete parser, API documentation, JSON Schema interoperability
- **v0.1** — Grammar frozen; breaking changes will bump major version
- Current status: v0.2 (parser and tooling complete, specification remains frozen)

See [`ROADMAP.md`](ROADMAP.md) for planned evolution.

## Research Status

- Current version: v0.1
- Methodology: structured autoethnography
- Validation focus:
  - Expressive adequacy
  - Temporal fidelity
  - Reduction in translation pressure
  - Explicit modeling of masking

This repository includes a submission-ready manuscript package targeting neurodiversity-affirming venues.

## Ethical Principles

- Emotional data is explicitly authored, never inferred
- Masking is self-reported, not assumed
- Interpretation is optional and non-prescriptive
- User autonomy and consent are central design constraints

E-Lang is intentionally resistant to coercive or surveillance-based use.

## Intended Uses

- Neurodivergent emotional journaling
- Therapy-adjacent communication scaffolds
- Research on emotional representation
- Human-AI interaction design
- Accessibility-focused emotional interfaces

## License

This repository is released under a permissive open-source license (see LICENSE).
The license governs legal use, modification, and distribution.

## Ethical Use (Non-Binding Statement)

The following principles are normative and non-binding. They do not impose
legal restrictions beyond the license terms, but articulate the intended and
responsible use of E-Lang as a research and accessibility framework:

- Emotional states should be explicitly authored by the individual, not inferred.
- Representation must remain separable from interpretation.
- Masking, suppression, or performance should never be assumed without consent.
- Use in clinical, evaluative, or AI-mediated systems should preserve user agency.

These principles are provided to guide responsible adoption and to clarify the
design intent of the framework. They do not modify or override the license.

## Continuous Integration (CI)

This repository uses continuous integration to ensure specification correctness and documentation quality.

**What CI checks:**

- **Markdown formatting consistency** — All `.md` files are linted using `markdownlint` with project-specific rules (`.markdownlint.json`)
- **Grammar/tooling regressions** — Parser test suite validates correctness against fixture files
- **Import and test discovery sanity** — Ensures Python package structure and test discovery work correctly

**What CI does NOT check:**

- CI does not enforce semantics
- CI does not validate emotional meaning
- CI does not gate research interpretation
- CI does not enforce code style beyond what's necessary for correctness

**Why CI exists for this project:**

CI ensures that changes to the specification, grammar, or tooling do not introduce regressions. It validates that the parser correctly implements the grammar defined in `ELANG.abnf` and that documentation remains consistently formatted. CI is a correctness gate, not an interpretation gate.

**Running CI locally:**
```bash
# Install dependencies
pip install -r requirements.txt
npm install -g markdownlint-cli

# Run tests
pytest tests/ -v

# Lint markdown
markdownlint '**/*.md' --config .markdownlint.json
```

CI runs on every push to `main` and on all pull requests.

## Status

This project represents a missing abstraction layer that has not been standardized elsewhere.
It is deliberately minimal, extensible, and grounded in lived experience.

## Maintenance Status

E-Lang v0.2.0 is stable and under maintenance. Grammar, parser, and schemas are frozen. See [`MAINTENANCE_STATUS.md`](MAINTENANCE_STATUS.md) for details.

## Contact and Attribution

Created by a neurodivergent researcher through lived use and formalization.
Attribution requested if adapted or cited in research or tooling.

E-Lang is infrastructure, not instruction.
