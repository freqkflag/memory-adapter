# E-Lang Maintenance Status

**Status:** Stable and under maintenance  
**Stable as of:** v0.2.0 (January 2026)  
**Maintenance mode:** Best-effort, no SLA

---

## Current State

E-Lang v0.2.0 is **stable** and suitable for use. The project has reached a maintenance phase where:

- **Grammar is frozen** — The language specification (`ELANG_SPEC.md`, `ELANG.abnf`) is stable
- **Parser is complete** — The reference parser (`elang_parser/`) implements the full grammar
- **Schemas are stable** — JSON Schemas for state and AST interchange are finalized
- **Documentation is current** — Tutorials, guides, and API documentation reflect v0.2.0

The project is **not abandoned**. It is in a **maintenance pause**, meaning active development has paused to allow the specification and tooling to stabilize.

---

## What Is Frozen

The following are **frozen** and will not change without a major version bump:

- **Grammar** — Syntax, operators, precedence (`ELANG_SPEC.md`, `ELANG.abnf`)
- **Axis set** — The eight axes `V,A,C,S,K,D,B,N` and their order
- **Parser behavior** — Public API and AST structure (`PARSER_API.md`)
- **JSON Schemas** — State and AST schema definitions
- **Core semantics** — Operator definitions and representation model

These elements are stable and can be relied upon for implementation and integration.

---

## Acceptable Reasons for Changes

Future changes will be considered only for:

### Critical Bugs
- Parser crashes on valid grammar
- Schema validation failures on correct data
- Documentation errors that cause misuse
- Security vulnerabilities (if applicable)

### Specification Corrections
- Clarifications that do not change behavior
- Documentation updates that improve accuracy
- Grammar corrections that fix ambiguities (if any are discovered)

**Note:** Bug fixes will preserve backward compatibility where possible. Breaking changes require major version bump.

---

## Response Cadence

- **Feedback:** Acknowledged as resources allow
- **Bug reports:** Triaged and addressed based on severity
- **Documentation issues:** Updated in maintenance cycles
- **Feature requests:** Acknowledged but not implemented (see below)

**No SLA (Service Level Agreement)** — Responses and fixes occur on a best-effort basis. There is no committed timeline for addressing issues.

---

## No New Features Planned

**At this time, no new features are planned.**

This includes:
- New axes or operators
- Semantic interpretation capabilities
- Expression evaluation or computation
- Clinical or diagnostic features
- Additional tooling beyond reference implementations

The project is focused on **stability and correctness**, not expansion.

---

## Future Considerations

If community interest or research needs emerge that require changes:

1. **Major version bump** — Breaking changes require v1.0 or higher
2. **Community discussion** — Significant changes require broad input
3. **Formal proposal process** — Major changes would follow structured evaluation

**No timeline is set** for such considerations. This is a statement of process, not a commitment to change.

---

## What This Means for Users

### You Can:
- Use E-Lang v0.2.0 in production or research
- Implement parsers, validators, and tools based on the specification
- Report bugs or documentation issues
- Extend E-Lang via `x_*` namespaced fields (see `EXTENSIONS.md`)
- Build application layers that add interpretation or evaluation

### You Should Not Expect:
- New features or grammar changes
- Rapid response to feature requests
- Active development or roadmap updates
- Timelines for future versions

### You Can Rely On:
- Grammar stability (frozen in v0.1, tooling complete in v0.2)
- Parser API stability (backward-compatible changes only)
- Schema stability (interchange format is fixed)
- Documentation accuracy (maintained as issues are found)

---

## Maintenance Scope

Maintenance activities include:

- **Bug fixes** — Correcting parser errors, schema issues, documentation mistakes
- **Documentation updates** — Clarifying existing content, fixing errors
- **Test maintenance** — Ensuring test suite continues to validate correctness
- **CI maintenance** — Keeping continuous integration functional

Maintenance does **not** include:
- Feature development
- Grammar evolution
- New tooling beyond critical fixes
- Roadmap planning

---

## Contact

For bug reports or documentation issues, see:
- [`REVIEW_GUIDELINES.md`](REVIEW_GUIDELINES.md) — What feedback is welcome
- [`FEEDBACK_TEMPLATE.md`](FEEDBACK_TEMPLATE.md) — How to submit feedback
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Contribution process

---

## Summary

E-Lang v0.2.0 is **stable, complete, and maintained**. The project is in a maintenance pause, not abandonment. Grammar, parser, and schemas are frozen. Bug fixes and documentation updates occur on a best-effort basis. No new features are planned at this time.

**The project is ready for use and integration.**

---

**Last updated:** January 2026 (v0.2.0)