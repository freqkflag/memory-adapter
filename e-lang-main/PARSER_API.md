# E-Lang Parser API

This document defines the public interface for the E-Lang reference parser.

**Version:** v0.2  
**Grammar Source:** `ELANG.abnf`  
**Specification:** `ELANG_SPEC.md`

---

## Overview

The E-Lang parser converts text strings into Abstract Syntax Trees (ASTs) representing the structure of E-Lang expressions. The parser performs **syntax analysis only**—no interpretation, evaluation, or semantic analysis.

---

## Public Functions

### `parse_state(text: str) -> State`

Parse a state vector expression only.

**Input:**
- `text`: String containing a canonical state vector: `E{V,A,C,S,K,D,B,N}`

**Output:**
- `State`: AST node with `values` field containing exactly 8 floats

**Raises:**
- `ValueError`: If input is not a valid state vector, has wrong number of axes, contains out-of-range values, or contains operators/expressions beyond a simple state

**Example:**
```python
from elang_parser import parse_state

state = parse_state("E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}")
assert len(state.values) == 8
```

**Backward Compatibility:**
- This function is maintained for compatibility with code that only needs state parsing
- For full expression parsing, use `parse_expression()` instead

---

### `parse_expression(text: str) -> Expr`

Parse a complete E-Lang expression (states, operators, functions, macros).

**Input:**
- `text`: String containing any valid E-Lang expression

**Output:**
- `Expr`: AST node (one of: `State`, `Macro`, `MaskCall`, `BinaryOp`, or `Context`)

**Raises:**
- `ValueError`: If input is not valid E-Lang syntax, contains out-of-range values, or has unexpected characters after a valid expression

**Example:**
```python
from elang_parser import parse_expression

# State
expr1 = parse_expression("E{0,0,0,0,0,0,0,0}")

# Transition
expr2 = parse_expression("E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}")

# Mask call
expr3 = parse_expression("mask(E{0,0,0,0,0,0,0,0}, 0.7)")

# Complex expression
expr4 = parse_expression("mask((E{0,0,0,0,0,0,0,0} ⊗ ctx(work)) ⊕ E{0,0,0,0,0,0,0,0}, 0.3)")
```

---

## AST Node Types

### `State`

Represents a canonical state vector: `E{V,A,C,S,K,D,B,N}`

**Fields:**
- `values: List[float]` — Exactly 8 floats in order: Valence, Arousal, Agency, Safety, Certainty, Dominance, Attachment, Novelty
- Each value must be in range `[-1.0, +1.0]`

**Example:**
```python
state = State(values=[-0.4, 0.7, -0.2, -0.6, -0.1, -0.3, 0.8, 0.2])
```

---

### `Macro`

Represents a macro identifier (e.g., `ALARM`, `BOND`).

**Fields:**
- `name: str` — Macro identifier (alphanumeric, underscores, dashes)

**Example:**
```python
macro = Macro(name="ALARM")
```

---

### `Context`

Represents a context annotation: `ctx(tag)`.

**Fields:**
- `tag: str` — Context tag identifier (alphanumeric, underscores, dashes)

**Example:**
```python
ctx = Context(tag="work")
```

---

### `MaskCall`

Represents a masking annotation: `mask(expr, m)`.

**Fields:**
- `expr: Expr` — Expression being masked
- `value: float` — Mask intensity in range `[0.0, 1.0]`

**Example:**
```python
mask_call = MaskCall(
    expr=State(values=[0.0] * 8),
    value=0.7
)
```

---

### `BinaryOp`

Represents a binary operator expression.

**Fields:**
- `left: Expr` — Left operand
- `op: str` — Operator: `'→'` (transition), `'⊕'` (blend), `'⟂'` (conflict), or `'⊗'` (context modulation)
- `right: Expr` — Right operand

**Example:**
```python
transition = BinaryOp(
    left=State(values=[0.0] * 8),
    op='→',
    right=State(values=[1.0] * 8)
)
```

---

### `Expr` (Type Union)

Type alias for any valid expression node:
```python
Expr = Union[State, Macro, Context, MaskCall, BinaryOp]
```

---

## Operator Precedence Guarantees

The parser enforces operator precedence as defined in `ELANG_SPEC.md`:

**Precedence (highest to lowest):**

1. `mask(expr, m)` — Function call (highest precedence)
2. `expr ⊗ ctx(tag)` — Context modulation
3. `expr ⊕ expr` and `expr ⟂ expr` — Blend and conflict (same precedence)
4. `expr → expr` — Transition (lowest precedence)

**Associativity:**

- `⊕` (blend) — Left-associative
- `⟂` (conflict) — Left-associative
- `→` (transition) — Left-associative
- `⊗` (context modulation) — Left-associative

**Parentheses:**

Parentheses `(expr)` override precedence and force evaluation order.

**Examples:**

```python
# mask() binds tightest
expr = parse_expression("mask(E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0}, 0.5)")
# AST: MaskCall(expr=BinaryOp(op='⊕', ...), value=0.5)

# ⊗ binds tighter than ⊕
expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊗ ctx(work) ⊕ E{0,0,0,0,0,0,0,0}")
# AST: BinaryOp(op='⊕', left=BinaryOp(op='⊗', ...), right=State(...))

# → binds loosest
expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0}")
# AST: BinaryOp(op='→', left=BinaryOp(op='⊕', ...), right=State(...))
```

---

## Input Expectations

### Valid Input

- **Whitespace:** Leading/trailing whitespace is stripped. Spaces and tabs around operators, commas, and parentheses are tolerated.
- **State vectors:** Must have exactly 8 comma-separated values in brackets: `E{...}`
- **Axis values:** Floats in range `[-1.0, +1.0]` (inclusive)
- **Mask values:** Floats in range `[0.0, 1.0]` (inclusive)
- **Context tags:** Identifiers: `[a-zA-Z0-9_-]+`
- **Macros:** Identifiers: `[a-zA-Z0-9_-]+`

### Invalid Input

The parser raises `ValueError` for:
- Syntax errors (missing braces, commas, parentheses)
- Wrong number of axis values (not exactly 8)
- Out-of-range axis values (outside `[-1.0, +1.0]`)
- Out-of-range mask values (outside `[0.0, 1.0]`)
- Empty context tags
- Unexpected characters after a valid expression
- Ambiguous or malformed expressions

**The parser does NOT:**
- Auto-correct syntax errors
- Normalize or simplify expressions
- Infer missing values
- Apply heuristics to recover from errors

---

## Output Guarantees

### AST Structure

- **Complete:** The AST represents the entire input expression structure
- **Preserved:** Operator precedence and associativity are reflected in AST structure
- **Validated:** Range constraints are enforced (axes `[-1, 1]`, mask `[0, 1]`)
- **Typed:** Each node is an instance of a specific AST class

### AST Traversal

ASTs can be traversed recursively:
- `BinaryOp` nodes have `left` and `right` fields (both `Expr`)
- `MaskCall` nodes have `expr` field (`Expr`)
- Leaf nodes are `State`, `Macro`, or `Context`

---

## What the Parser Does NOT Do

The parser is **syntax-only**. It does not:

- **Evaluate expressions** — No computation of operator semantics
- **Normalize expressions** — No simplification or canonicalization
- **Interpret semantics** — No mapping to emotion words or meanings
- **Validate semantics** — No checking of logical consistency
- **Resolve macros** — Macros are identifiers only, not expanded
- **Apply context** — Context tags are annotations, not modifiers
- **Auto-correct** — Invalid input raises errors, not corrections
- **Infer values** — Missing or ambiguous values cause errors

---

## Error Behavior

### `ValueError` Exceptions

All parsing errors raise `ValueError` with descriptive messages:

- **Syntax errors:** "Invalid canonical E-Lang state syntax" or "Expected 'X' at position Y"
- **Range errors:** "Axis value out of range: X" or "Mask value out of range: X"
- **Count errors:** "State must have exactly 8 axis values"
- **Unexpected input:** "Unexpected characters at position X: ..."

**Error messages are:**
- Non-empty
- Actionable (indicate what was expected)
- Include position information when relevant

---

## Versioning Guarantees

### API Stability

**v0.2 (Current):**
- `parse_state()` and `parse_expression()` are stable
- AST node types and fields are stable
- Operator precedence is fixed
- Error types (`ValueError`) are stable

**Backward Compatibility:**
- `parse_state()` will continue to accept state vectors only
- Existing AST node structures will not change in incompatible ways
- Breaking changes to the API will require a major version bump

**Future Changes:**
- New AST node types may be added for grammar extensions
- New functions may be added (e.g., `parse_file()`, `format_ast()`)
- Error message text may change (but error types remain `ValueError`)

---

## Implementation Notes

### Grammar Conformance

The parser implements `ELANG.abnf` exactly:
- Recursive descent parsing following ABNF structure
- Whitespace handling per `wsp = 1*( SP / HTAB )`
- Operator precedence per `ELANG_SPEC.md` section 5.2

### Reference Implementation

This parser is a **reference implementation**:
- Correctness is prioritized over performance
- Behavior matches the grammar specification
- Suitable for validation, tooling, and learning

---

## Usage Examples

### Basic State Parsing

```python
from elang_parser import parse_state

state = parse_state("E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}")
print(f"Valence: {state.values[0]}")
print(f"Arousal: {state.values[1]}")
```

### Expression Parsing

```python
from elang_parser import parse_expression
from elang_parser.ast import BinaryOp, MaskCall

# Parse transition
expr = parse_expression("E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}")
if isinstance(expr, BinaryOp) and expr.op == '→':
    print(f"Transition from {len(expr.left.values)} axes to {len(expr.right.values)} axes")

# Parse mask call
expr = parse_expression("mask(E{0,0,0,0,0,0,0,0}, 0.7)")
if isinstance(expr, MaskCall):
    print(f"Mask intensity: {expr.value}")
```

### AST Traversal

```python
from elang_parser import parse_expression
from elang_parser.ast import BinaryOp, State

def count_states(expr):
    """Count State nodes in an expression."""
    if isinstance(expr, State):
        return 1
    elif isinstance(expr, BinaryOp):
        return count_states(expr.left) + count_states(expr.right)
    elif isinstance(expr, MaskCall):
        return count_states(expr.expr)
    else:
        return 0

expr = parse_expression("E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}")
print(f"Expression contains {count_states(expr)} states")
```

---

## See Also

- `ELANG_SPEC.md` — Language specification
- `ELANG.abnf` — Formal grammar
- `tests/test_expression_parser.py` — Parser test suite
- `tests/fixtures/` — Valid and invalid expression examples