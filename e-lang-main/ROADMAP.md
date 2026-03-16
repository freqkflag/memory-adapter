# E-Lang Roadmap

This roadmap describes the planned evolution of E-Lang from an initial public
specification to a stable, real-world usable language.

Dates are intentionally omitted; progress is gated by correctness and clarity.

---

## v0.1 — Public Spec Lock (Current)

**Goal:** Establish a stable, reviewable foundation.

Deliverables:
- Canonical specification (`ELANG_SPEC.md`)
- Formal grammar (`ELANG.abnf`)
- Macro library (`ELANG_MACROS.md`)
- Journal template
- Placeholder tests
- Unified manuscript (`MANUSCRIPT.md`)
- Clear ethical boundaries (non-binding)

Status:
- ✔ Spec defined
- ✔ Grammar defined
- ✔ Research framing complete

---

## v0.2 — Reference Tooling

**Goal:** Make the language executable without changing semantics.

Deliverables:
- Reference parser (Python or TypeScript)
- AST definition
- Grammar validation tests
- Canonical formatter
- Round-trip serialization tests

Non-goals:
- No new axes
- No semantic interpretation engine

Status:
- ✔ Reference parser (Python) — Grammar-complete expression parser
- ✔ AST definition — Complete node types for all expressions
- ✔ Grammar validation tests — 34+ tests covering full grammar
- ✔ Parser API documentation — `PARSER_API.md` complete
- ✔ JSON Schema interoperability — State and AST schemas
- ⏳ Canonical formatter — Deferred to v0.3
- ⏳ Round-trip serialization tests — Deferred to v0.3

---

## v0.3 — Usability & Documentation

**Goal:** Enable real users to adopt E-Lang correctly.

Deliverables:
- Developer documentation
- Visual diagrams (axes, transitions)
- Example journals (synthetic data)
- "How to use E-Lang" guide
- Error-message standards for invalid syntax

---

## v0.4 — Research & Replication

**Goal:** Support external research use.

Deliverables:
- Replication notes
- Multi-participant study protocol draft
- Data schemas for anonymized datasets
- Citation file (`CITATION.cff`)

---

## v0.5 — Interoperability

**Goal:** Allow safe integration with other systems.

Deliverables:
- JSON schema
- Optional ASCII operator aliases (non-canonical)
- API contracts for tooling
- Clear extension mechanisms

---

## v1.0 — Stable Language Release

**Goal:** Declare E-Lang stable for long-term use.

Criteria:
- Grammar frozen
- Reference parser battle-tested
- Backward compatibility guarantees
- Clear versioning policy
- Public documentation complete

Non-goals (even at v1.0):
- Diagnosis
- Therapy automation
- Emotion prediction
- Normative emotional scoring

---

## North Star

E-Lang is successful when:
- Implementations remain compatible
- Users can represent emotion without naming it
- Meaning can be added later—or not at all
- Neurodivergent users experience reduced translation pressure

Stability > novelty.