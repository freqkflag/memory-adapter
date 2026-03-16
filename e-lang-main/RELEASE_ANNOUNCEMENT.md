# E-Lang v0.2.0 Release Announcement

**Release Date:** January 2026  
**Version:** v0.2.0  
**Repository:** https://github.com/freqkflag/e-lang  
**DOI:** [Zenodo DOI placeholder — to be minted upon publication]

---

## What Is E-Lang?

E-Lang is a **formal symbolic language** for representing emotional experience **prior to linguistic labeling**. It is infrastructure for emotional representation, not a diagnostic system, therapeutic protocol, or emotion taxonomy.

E-Lang separates **representation** from **interpretation**:
- **Representation:** structured, continuous description of state and change
- **Interpretation:** optional translation into emotion words, needs, or narratives (not part of E-Lang)

The language encodes emotional states as vectors across eight continuous axes (Valence, Arousal, Agency, Safety, Certainty, Dominance, Attachment, Novelty) and provides operators for representing transitions, blends, conflicts, context, and masking.

---

## What Is Frozen in v0.2.0

### Grammar (frozen in v0.1)
- **Axis set and order:** `V,A,C,S,K,D,B,N` (fixed)
- **Canonical state syntax:** `E{V,A,C,S,K,D,B,N}` (fixed)
- **Operator set:** `→`, `⊕`, `⟂`, `⊗`, `mask()`, `ctx()` (fixed)
- **Operator precedence:** Defined and fixed
- **Grammar definition:** `ELANG.abnf` (frozen)

Breaking changes to grammar require a **major version bump**.

### API (stable in v0.2)
- **Parser functions:** `parse_state()`, `parse_expression()` (stable)
- **AST node structures:** Fields preserved
- **Error types:** `ValueError` standard
- **JSON Schemas:** State and AST schemas stable

---

## What v0.2.0 Adds

### Grammar-Complete Parser
- Full expression parsing supporting all grammar constructs
- Operator precedence correctly enforced
- Backward-compatible `parse_state()` function
- Comprehensive test suite (34+ tests)

### Parser API Documentation
- Complete interface documentation (`PARSER_API.md`)
- AST node type definitions
- Error handling specifications
- Versioning guarantees

### JSON Schema Interoperability
- `elang_state.schema.json` — Canonical state vector schema
- `elang_ast.schema.json` — AST serialization schema
- Extension support via `x_*` namespaced keys
- Validation examples and documentation

### Adoption Documentation
- `TUTORIAL.md` — First-time user guide
- `DEVELOPER_GUIDE.md` — Tool builder reference
- `EXTENSIONS.md` — Safe extension practices

---

## What Is Explicitly Out of Scope

E-Lang v0.2.0 does **not** include:

- **Semantic interpretation** — No mapping to emotion words or labels
- **Expression evaluation** — No computation of operator results
- **Diagnosis or therapy** — Not a medical or therapeutic tool
- **Automated affect inference** — States must be user-authored
- **Normative emotional judgments** — No "correct" or "healthy" states
- **Behavior prediction** — Representation only, no inference
- **Emotion taxonomies** — No categorization or labeling systems

Interpretation is optional and explicitly separated from representation.

---

## Technical Details

### Specification
- **Grammar:** `ELANG.abnf` (RFC 5234 style ABNF)
- **Specification:** `ELANG_SPEC.md` (complete language definition)
- **Parser API:** `PARSER_API.md` (interface documentation)

### Implementation
- **Reference parser:** Python implementation in `elang_parser/`
- **Test suite:** Comprehensive coverage in `tests/`
- **CI:** Automated validation on every commit

### Interoperability
- **JSON Schemas:** Draft 2020-12 compliant
- **Extension support:** `x_*` namespaced fields
- **Backward compatibility:** v0.1 grammar preserved

---

## Intended Uses

E-Lang is designed for:
- Neurodivergent emotional journaling
- Research on emotional representation
- Therapy-adjacent communication scaffolds
- Human-AI interaction design
- Accessibility-focused emotional interfaces

E-Lang is **not** designed for:
- Clinical diagnosis
- Therapeutic protocols
- Automated emotion inference
- Surveillance or coercive systems

---

## License and Citation

**License:** MIT (see `LICENSE` file)

**Citation:**
```
King, J. (2026). E-Lang: A Formal Symbolic Language for Pre-Linguistic Emotional Representation (Version 0.2.0) [Computer software]. 
GitHub. https://github.com/freqkflag/e-lang
DOI: [Zenodo DOI placeholder]
```

**Preferred citation format:** See `CITATION.cff` for machine-readable citation metadata.

---

## Getting Started

- **New users:** See [`TUTORIAL.md`](TUTORIAL.md)
- **Developers:** See [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md)
- **Contributors:** See [`CONTRIBUTING.md`](CONTRIBUTING.md)

---

## Project Status

E-Lang v0.2.0 represents a **stable reference implementation** of the frozen v0.1 grammar. The specification is complete, the parser is grammar-complete, and interoperability tooling is available.

Future work may include:
- Additional parser implementations (TypeScript, Rust)
- Canonical formatter
- Extended documentation and tutorials

No timeline is committed. Stability and correctness take precedence over expansion.

---

## Acknowledgments

E-Lang was developed through lived use and formalization. The language is designed to reduce translation pressure and support neurodivergent communication.

---

**E-Lang is infrastructure, not instruction.**  
**Representation is structural; interpretation is optional.**