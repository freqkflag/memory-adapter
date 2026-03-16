# E-Lang Developer Guide

A guide for developers building parsers, validators, storage layers, or other tooling around E-Lang.

**Audience:** Developers, tool builders, system integrators  
**Prerequisites:** Familiarity with parsing, ASTs, and data validation

---

## Overview

This guide covers how to:
- Use the reference parser API
- Consume and validate E-Lang ASTs
- Validate data using JSON Schemas
- Handle errors correctly
- Understand versioning guarantees

For complete API reference, see [`PARSER_API.md`](PARSER_API.md).

---

## Using the Parser

### Basic State Parsing

```python
from elang_parser import parse_state

# Parse a state vector
state = parse_state("E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}")

# Access axis values
valence = state.values[0]  # V
arousal = state.values[1]  # A
# ... etc

# Validate structure
assert len(state.values) == 8
assert all(-1.0 <= v <= 1.0 for v in state.values)
```

### Full Expression Parsing

```python
from elang_parser import parse_expression
from elang_parser.ast import BinaryOp, MaskCall, Context

# Parse any E-Lang expression
expr = parse_expression("E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}")

# Check AST type
if isinstance(expr, BinaryOp):
    assert expr.op == '→'
    left_state = expr.left
    right_state = expr.right
```

### Error Handling

All parsing errors raise `ValueError`:

```python
from elang_parser import parse_state, parse_expression

try:
    state = parse_state("E{0,0,0,0,0,0,0}")  # Wrong number of axes
except ValueError as e:
    print(f"Parse error: {e}")

try:
    expr = parse_expression("E{0,0,0,0,0,0,0,2}")  # Out of range
except ValueError as e:
    print(f"Validation error: {e}")
```

**Error types:**
- Syntax errors: "Invalid canonical E-Lang state syntax" or "Expected 'X' at position Y"
- Range errors: "Axis value out of range: X" or "Mask value out of range: X"
- Count errors: "State must have exactly 8 axis values"
- Unexpected input: "Unexpected characters at position X"

---

## Consuming ASTs Safely

### AST Node Types

```python
from elang_parser.ast import State, Macro, Context, MaskCall, BinaryOp

# State node
if isinstance(expr, State):
    values = expr.values  # List[float], exactly 8 elements

# Macro node
elif isinstance(expr, Macro):
    name = expr.name  # str

# Context node
elif isinstance(expr, Context):
    tag = expr.tag  # str

# Mask call
elif isinstance(expr, MaskCall):
    inner_expr = expr.expr  # Expr
    mask_value = expr.value  # float, in [0.0, 1.0]

# Binary operator
elif isinstance(expr, BinaryOp):
    left = expr.left  # Expr
    op = expr.op  # str: '→', '⊕', '⟂', or '⊗'
    right = expr.right  # Expr
```

### Recursive AST Traversal

```python
def count_states(expr):
    """Count State nodes in an expression."""
    if isinstance(expr, State):
        return 1
    elif isinstance(expr, BinaryOp):
        return count_states(expr.left) + count_states(expr.right)
    elif isinstance(expr, MaskCall):
        return count_states(expr.expr)
    elif isinstance(expr, (Macro, Context)):
        return 0
    else:
        raise TypeError(f"Unknown AST node type: {type(expr)}")
```

### What NOT to Assume

**Do NOT assume:**
- ASTs are normalized or simplified
- Operators have been evaluated
- Macros have been expanded
- Context has been applied
- Expressions are in canonical form

**DO assume:**
- AST structure reflects operator precedence
- Range constraints are enforced
- Syntax is valid
- Structure is complete

---

## JSON Schema Validation

### State Schema Validation

```python
import json
import jsonschema

# Load schema
with open('elang_state.schema.json') as f:
    state_schema = json.load(f)

# Validate state data
state_data = {
    "V": -0.4,
    "A": 0.7,
    "C": -0.2,
    "S": -0.6,
    "K": -0.1,
    "D": -0.3,
    "B": 0.8,
    "N": 0.2
}

try:
    jsonschema.validate(instance=state_data, schema=state_schema)
    print("Valid state")
except jsonschema.ValidationError as e:
    print(f"Invalid state: {e}")
```

### Handling Extensions

The state schema allows `x_*` namespaced extension keys:

```python
state_with_extension = {
    "V": 0.0,
    "A": 0.0,
    "C": 0.0,
    "S": 0.0,
    "K": 0.0,
    "D": 0.0,
    "B": 0.0,
    "N": 0.0,
    "x_custom": {
        "note": "Extension data"
    }
}

# Schema validates this (x_* keys are allowed)
jsonschema.validate(instance=state_with_extension, schema=state_schema)

# Your code should ignore unknown x_* keys if not recognized
for key, value in state_with_extension.items():
    if key.startswith('x_'):
        # Handle or ignore extension
        continue
    # Process standard axis
```

### AST Schema Validation

```python
import json
import jsonschema

# Load AST schema
with open('elang_ast.schema.json') as f:
    ast_schema = json.load(f)

# Validate serialized AST
ast_data = {
    "type": "binaryOp",
    "op": "→",
    "left": {
        "type": "state",
        "values": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    },
    "right": {
        "type": "state",
        "values": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
    }
}

jsonschema.validate(instance=ast_data, schema=ast_schema)
```

---

## Error Handling Expectations

### Parser Errors

The parser raises `ValueError` for all errors. Error messages are:
- **Non-empty** — Always provide information
- **Actionable** — Indicate what was expected
- **Position-aware** — Include position when relevant

**Example error handling:**
```python
def safe_parse(text):
    try:
        return parse_expression(text)
    except ValueError as e:
        error_msg = str(e)
        if "out of range" in error_msg:
            # Handle range violation
            return None
        elif "Expected" in error_msg:
            # Handle syntax error
            return None
        else:
            # Handle other errors
            return None
```

### Schema Validation Errors

JSON Schema validation raises `jsonschema.ValidationError`:

```python
import jsonschema

try:
    jsonschema.validate(instance=data, schema=schema)
except jsonschema.ValidationError as e:
    print(f"Validation failed: {e.message}")
    print(f"Path: {list(e.path)}")
    print(f"Schema path: {list(e.schema_path)}")
```

---

## Versioning Guarantees

### Grammar Stability (v0.1)

- **Grammar frozen** — `ELANG.abnf` will not change in incompatible ways
- **Axis set locked** — `V,A,C,S,K,D,B,N` order is fixed
- **Operator set fixed** — No new operators without major version bump
- **Breaking changes** — Require major version bump

### API Stability (v0.2)

- **`parse_state()`** — Stable, backward compatible
- **`parse_expression()`** — Stable interface
- **AST node structures** — Fields preserved
- **Error types** — `ValueError` remains standard
- **Future changes** — Breaking API changes require major version bump

### Schema Stability

- **State schema** — Matches `ELANG_SPEC.md` section 4
- **AST schema** — Matches `PARSER_API.md` definitions
- **Extension points** — `x_*` namespace reserved
- **Future changes** — Breaking schema changes require major version bump

---

## What NOT to Implement

### Do NOT Implement

- **Expression evaluation** — Don't compute operator results
- **Semantic interpretation** — Don't map to emotion words
- **Macro expansion** — Macros are identifiers only
- **Context application** — Context is annotation, not modifier
- **Normalization** — Don't simplify or canonicalize
- **Auto-correction** — Don't fix syntax errors silently

### DO Implement

- **Syntax validation** — Check structure matches grammar
- **Range validation** — Enforce `[-1.0, +1.0]` for axes, `[0.0, 1.0]` for mask
- **AST traversal** — Walk and inspect structure
- **Serialization** — Convert AST to JSON or other formats
- **Storage** — Persist states and expressions
- **Formatting** — Pretty-print expressions

---

## Implementation Patterns

### Parser Wrapper

```python
from elang_parser import parse_expression
from elang_parser.ast import State

def parse_and_validate(text):
    """Parse and perform additional validation."""
    expr = parse_expression(text)
    
    # Additional checks
    if isinstance(expr, State):
        # Custom validation
        pass
    
    return expr
```

### AST Serialization

```python
import json
from elang_parser.ast import State, BinaryOp, MaskCall, Context, Macro

def serialize_ast(expr):
    """Convert AST to JSON-serializable dict."""
    if isinstance(expr, State):
        return {
            "type": "state",
            "values": expr.values
        }
    elif isinstance(expr, Macro):
        return {
            "type": "macro",
            "name": expr.name
        }
    elif isinstance(expr, Context):
        return {
            "type": "context",
            "tag": expr.tag
        }
    elif isinstance(expr, MaskCall):
        return {
            "type": "mask",
            "expr": serialize_ast(expr.expr),
            "value": expr.value
        }
    elif isinstance(expr, BinaryOp):
        return {
            "type": "binaryOp",
            "op": expr.op,
            "left": serialize_ast(expr.left),
            "right": serialize_ast(expr.right)
        }
    else:
        raise TypeError(f"Unknown AST node: {type(expr)}")
```

### Storage Layer

```python
import json
from elang_parser import parse_expression

def store_expression(text, storage):
    """Parse and store expression."""
    # Parse to validate
    expr = parse_expression(text)
    
    # Store canonical text
    storage.save({
        "text": text,
        "parsed": True,
        "timestamp": datetime.now().isoformat()
    })
    
    # Optionally store AST
    ast_json = serialize_ast(expr)
    storage.save_ast(ast_json)
```

---

## Testing Your Implementation

### Test Against Fixtures

```python
from pathlib import Path
from elang_parser import parse_expression

# Load valid expressions
fixtures = Path('tests/fixtures/valid_expressions.txt')
for line in fixtures.read_text().splitlines():
    line = line.strip()
    if line and not line.startswith('#'):
        try:
            expr = parse_expression(line)
            # Your implementation should handle this
        except ValueError:
            # Should not happen for valid expressions
            raise
```

### Validate Against Schema

```python
import json
import jsonschema

def validate_serialized_ast(ast_dict):
    """Validate serialized AST against schema."""
    with open('elang_ast.schema.json') as f:
        schema = json.load(f)
    jsonschema.validate(instance=ast_dict, schema=schema)
```

---

## Reference Documentation

- [`PARSER_API.md`](PARSER_API.md) — Complete parser interface
- [`ELANG_SPEC.md`](ELANG_SPEC.md) — Language specification
- [`ELANG.abnf`](ELANG.abnf) — Formal grammar
- [`elang_state.schema.json`](elang_state.schema.json) — State JSON Schema
- [`elang_ast.schema.json`](elang_ast.schema.json) — AST JSON Schema

---

## See Also

- [`TUTORIAL.md`](TUTORIAL.md) — User-facing tutorial
- [`EXTENSIONS.md`](EXTENSIONS.md) — Extension practices
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Contribution guidelines

---

**E-Lang tooling should validate structure, not interpret meaning.**