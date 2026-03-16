# E-Lang v0.2.0 — Reference Tooling Release

This release adds **grammar-complete parsing** and **interoperability tooling** to the frozen v0.1 specification.

**Release Date:** January 2026  
**Version:** v0.2.0  
**Status:** Parser and schemas complete; specification remains frozen

---

## What This Release Adds

### Grammar-Complete Parser

- **Full expression parsing** — Supports all E-Lang grammar constructs:
  - Binary operators: `→` (transition), `⊕` (blend), `⟂` (conflict), `⊗` (context modulation)
  - Function calls: `mask(expr, m)`
  - Context annotations: `ctx(tag)`
  - Parenthesized expressions
  - Macro identifiers
  - Nested expressions of arbitrary depth

- **Operator precedence** — Correctly enforces precedence as defined in `ELANG_SPEC.md`:
  1. `mask(expr, m)` (highest)
  2. `expr ⊗ ctx(tag)`
  3. `expr ⊕ expr` and `expr ⟂ expr`
  4. `expr → expr` (lowest)

- **Backward compatibility** — `parse_state()` function preserved for state-only parsing

### Parser API Documentation

- **`PARSER_API.md`** — Complete interface documentation:
  - Public functions: `parse_state()`, `parse_expression()`
  - AST node types and fields
  - Operator precedence guarantees
  - Error behavior specifications
  - Versioning guarantees
  - Usage examples

### JSON Schema Interoperability

- **`elang_state.schema.json`** — Canonical state vector schema:
  - 8 axis keys: `V`, `A`, `C`, `S`, `K`, `D`, `B`, `N`
  - Value constraints: `[-1.0, +1.0]`
  - Extension support via `x_*` namespaced keys
  - Matches `ELANG_SPEC.md` section 4 exactly

- **`elang_ast.schema.json`** — AST serialization schema:
  - All AST node types: `State`, `Macro`, `Context`, `MaskCall`, `BinaryOp`
  - Recursive structure for nested expressions
  - Operator validation
  - Range constraints enforced

- **Schema documentation** — `schemas/README.md` with validation examples

### Test Suite Expansion

- **34 test functions** covering:
  - Boundary values (-1, 0, +1)
  - Malformed syntax detection
  - Whitespace tolerance
  - Operator precedence
  - Associativity rules
  - Complex nested expressions
  - Error message quality

### CI Hardening

- Enhanced error messages in CI workflow
- Documented CI guarantees in README
- Pinned dependencies for stability

---

## What Remains Frozen (v0.1)

- **Grammar** — `ELANG.abnf` unchanged
- **Specification** — `ELANG_SPEC.md` unchanged
- **Axis set** — `V,A,C,S,K,D,B,N` unchanged
- **Operator semantics** — No interpretation or evaluation added
- **Syntax** — No new operators or constructs

---

## Compatibility Guarantees

### Backward Compatibility

- **`parse_state()` function** — Unchanged behavior, accepts state vectors only
- **AST node structures** — Existing fields preserved
- **Error types** — All errors remain `ValueError`
- **Grammar** — No breaking syntax changes

### API Stability

- **v0.2 API** — `parse_state()` and `parse_expression()` are stable
- **AST types** — Node structures are stable
- **Future changes** — Breaking API changes require major version bump

---

## What Is Explicitly Out of Scope

This release adds **parsing and validation only**. It does NOT add:

- **Semantic interpretation** — No mapping to emotion words or meanings
- **Expression evaluation** — No computation of operator results
- **Normalization** — No simplification or canonicalization
- **Macro expansion** — Macros remain identifiers only
- **Context application** — Context tags are annotations, not modifiers
- **Diagnosis or therapy** — Not a clinical tool
- **Emotion labeling** — No taxonomies or categorization

---

## Files Added in v0.2

### Parser Implementation
- `elang_parser/parser.py` — Full expression parser
- `elang_parser/ast.py` — AST node definitions
- `elang_parser/validate.py` — Range validation
- `elang_parser/__init__.py` — Package exports

### Documentation
- `PARSER_API.md` — Parser interface documentation

### Schemas
- `elang_state.schema.json` — State vector JSON Schema
- `elang_ast.schema.json` — AST serialization JSON Schema
- `schemas/README.md` — Schema documentation
- `schemas/examples/` — Example JSON documents

### Tests
- `tests/test_expression_parser.py` — 34 expression parser tests
- `tests/test_reference_parser.py` — Expanded state parser tests

---

## Usage Examples

### Basic State Parsing

```python
from elang_parser import parse_state

state = parse_state("E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}")
print(f"Valence: {state.values[0]}")
```

### Full Expression Parsing

```python
from elang_parser import parse_expression
from elang_parser.ast import BinaryOp, MaskCall

# Parse transition
expr = parse_expression("E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}")
if isinstance(expr, BinaryOp) and expr.op == '→':
    print("Transition detected")

# Parse mask call
expr = parse_expression("mask(E{0,0,0,0,0,0,0,0}, 0.7)")
if isinstance(expr, MaskCall):
    print(f"Mask intensity: {expr.value}")
```

### JSON Schema Validation

```python
import json
import jsonschema

# Validate state
with open('elang_state.schema.json') as f:
    schema = json.load(f)

state_data = {"V": 0.5, "A": 0.3, "C": 0.0, "S": 0.0, 
              "K": 0.0, "D": 0.0, "B": 0.0, "N": 0.0}
jsonschema.validate(instance=state_data, schema=schema)
```

---

## Migration from v0.1

**No migration required.** v0.2 is fully backward compatible:

- Existing code using `parse_state()` continues to work
- Grammar and specification unchanged
- All v0.1 guarantees preserved

**New capabilities available:**
- Use `parse_expression()` for full expression parsing
- Validate JSON data with provided schemas
- Reference `PARSER_API.md` for complete interface documentation

---

## What's Next (v0.3)

Per `ROADMAP.md`, v0.3 will focus on:
- Developer documentation and tutorials
- Visual diagrams and examples
- "How to use E-Lang" guide
- Error message standards

---

## Testing

All tests pass:
- 34 expression parser tests
- Expanded state parser tests
- Fixture-based validation
- CI workflow validates on every commit

Run tests:
```bash
pytest tests/ -v
```

---

## Acknowledgments

v0.2 delivers the reference tooling milestone from `ROADMAP.md`, making E-Lang executable and interoperable while preserving the frozen specification from v0.1.

---

**E-Lang is infrastructure.**  
**v0.2 adds tooling; v0.1 grammar remains frozen.**