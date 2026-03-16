# E-Lang Reference Tools

Optional command-line tools for validating, inspecting, and formatting E-Lang data.

**Status:** Reference implementations only  
**Purpose:** Aid validation, inspection, and safe downstream development  
**Limitation:** Structure-only operations; no interpretation or evaluation

---

## Tools

### `validate_json.py` — JSON Schema Validator

Validates JSON data against E-Lang JSON Schemas.

**Usage:**
```bash
python3 tools/validate_json.py --schema elang_state.schema.json data.json
python3 tools/validate_json.py --schema elang_ast.schema.json ast.json
```

**What it does:**
- Validates JSON structure against schema
- Checks value ranges (axes `[-1.0, +1.0]`, mask `[0.0, 1.0]`)
- Verifies required fields and types

**What it does NOT do:**
- Interpret emotional meaning
- Evaluate expressions
- Validate semantics or logic
- Provide emotional labels or scores

**Dependencies:**
- Optional: `jsonschema` package for full validation (install with `pip install jsonschema`)
- Falls back to basic JSON structure check if `jsonschema` not available

---

### `pretty_ast.py` — AST Pretty-Printer

Prints a structural representation of a parsed E-Lang expression.

**Usage:**
```bash
python3 tools/pretty_ast.py "E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}"
echo "E{0,0,0,0,0,0,0,0}" | python3 tools/pretty_ast.py
```

**What it does:**
- Parses E-Lang expression
- Displays AST structure as indented tree
- Shows node types and values

**What it does NOT do:**
- Explain what expressions "mean"
- Evaluate or compute results
- Provide emotional interpretations
- Suggest labels or categories

**Example output:**
```
BinaryOp(
  op='→',
  left=
    State(values=[+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0]),
  right=
    State(values=[+1.0, +1.0, +1.0, +1.0, +1.0, +1.0, +1.0, +1.0])
)
```

---

### `format_expr.py` — Expression Formatter

Formats E-Lang expressions in canonical form (lossless, round-trippable).

**Usage:**
```bash
python3 tools/format_expr.py "E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}"
echo "E{0,0,0,0,0,0,0,0}" | python3 tools/format_expr.py
```

**What it does:**
- Parses expression to validate structure
- Formats output in canonical form
- Preserves all information (lossless)
- Adds consistent whitespace around operators

**What it does NOT do:**
- Simplify or normalize expressions
- Evaluate operators
- Remove "redundant" structure
- Change meaning or semantics

**Round-trip guarantee:**
```
Input:  E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}
Output: E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}
        (formatted, but semantically identical)
```

---

## When NOT to Use These Tools

**Do NOT use these tools for:**
- Emotional interpretation or labeling
- Expression evaluation or computation
- Semantic analysis or meaning extraction
- Clinical or diagnostic purposes
- Automated emotion inference
- Generating emotional scores or categories

**These tools are for:**
- Structure validation
- Data inspection
- Formatting consistency
- Development and debugging

---

## Dependencies

### Required
- Python 3.11+
- `elang_parser` package (from repository root)

### Optional
- `jsonschema` — For full JSON Schema validation in `validate_json.py`
  - Install: `pip install jsonschema`
  - Without it: `validate_json.py` performs basic JSON structure checks only

---

## Installation

These tools are part of the E-Lang repository. No separate installation needed:

```bash
# From repository root
python3 tools/validate_json.py --help
python3 tools/pretty_ast.py --help
python3 tools/format_expr.py --help
```

---

## Examples

### Validate State JSON
```bash
# Create test data
echo '{"V": 0.5, "A": 0.3, "C": 0.0, "S": 0.0, "K": 0.0, "D": 0.0, "B": 0.0, "N": 0.0}' > test_state.json

# Validate
python3 tools/validate_json.py --schema elang_state.schema.json test_state.json
```

### Inspect AST Structure
```bash
python3 tools/pretty_ast.py "mask(E{0,0,0,0,0,0,0,0} ⊗ ctx(work), 0.7)"
```

### Format Expression
```bash
python3 tools/format_expr.py "E{0,0,0,0,0,0,0,0}→E{1,1,1,1,1,1,1,1}"
# Output: E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}
```

---

## Limitations

- **No evaluation** — Tools do not compute operator results
- **No interpretation** — Tools do not map to emotion words
- **No semantics** — Tools validate structure, not meaning
- **No inference** — Tools require explicit input

---

## See Also

- [`PARSER_API.md`](../PARSER_API.md) — Parser interface documentation
- [`DEVELOPER_GUIDE.md`](../DEVELOPER_GUIDE.md) — Developer reference
- [`elang_state.schema.json`](../elang_state.schema.json) — State schema
- [`elang_ast.schema.json`](../elang_ast.schema.json) — AST schema

---

**These tools are reference implementations. They demonstrate correct usage without introducing interpretation.**