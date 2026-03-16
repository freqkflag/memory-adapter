# E-Lang JSON Schemas

This directory contains JSON Schema definitions for E-Lang data interchange.

## Purpose

These schemas enable:
- **Validation** of E-Lang data in JSON format
- **Interoperability** between different implementations
- **Type safety** for tooling and APIs
- **Documentation** of the data contract

The schemas are **structural only**—they define format, not semantics.

## Schemas

### `elang_state.schema.json`

Canonical JSON representation of E-Lang state vectors.

**Corresponds to:** `ELANG_SPEC.md` section 4 (Equivalent Machine Serialization)

**Features:**
- 8 axis keys: `V`, `A`, `C`, `S`, `K`, `D`, `B`, `N`
- Value constraints: `[-1.0, +1.0]` for all axes
- Missing keys default to `0.0` (per specification)
- Extension support via `x_*` namespaced keys
- Disallows unknown non-namespaced keys

**Example:**
```json
{
  "V": -0.4,
  "A": 0.7,
  "C": -0.2,
  "S": -0.6,
  "K": -0.1,
  "D": -0.3,
  "B": 0.8,
  "N": 0.2
}
```

### `elang_ast.schema.json`

JSON schema for serialized E-Lang Abstract Syntax Trees.

**Corresponds to:** `PARSER_API.md` AST node definitions

**Features:**
- Supports all AST node types: `State`, `Macro`, `Context`, `MaskCall`, `BinaryOp`
- Recursive structure for nested expressions
- Operator validation: `→`, `⊕`, `⟂`, `⊗`
- Range constraints enforced
- Type discrimination via `type` field

**Example:**
```json
{
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
```

## Examples

See `examples/` directory for:
- Valid state representations
- Valid AST serializations
- Extension usage patterns

## Validation

### Using Python

```python
import json
import jsonschema

# Load schema
with open('elang_state.schema.json') as f:
    schema = json.load(f)

# Validate data
with open('data.json') as f:
    data = json.load(f)

jsonschema.validate(instance=data, schema=schema)
```

### Using JavaScript/Node.js

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = require('./elang_state.schema.json');
const validate = ajv.compile(schema);

const data = { V: 0.5, A: 0.3 };
const valid = validate(data);
if (!valid) console.log(validate.errors);
```

## Extension Points

### State Schema Extensions

Extensions must be namespaced with `x_` prefix:

```json
{
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
```

Implementations should:
- Ignore unknown `x_*` keys if configured to do so
- Reject unknown non-namespaced keys
- Document any recognized extension keys

## Constraints

These schemas enforce:

- **Structure** — Required fields, types, constraints
- **Ranges** — Axis values `[-1.0, +1.0]`, mask values `[0.0, 1.0]`
- **Format** — Valid identifiers, operators, node types

These schemas do NOT enforce:

- **Semantics** — No interpretation of emotional meaning
- **Evaluation** — No computation of operator results
- **Normalization** — No simplification or canonicalization
- **Validation** — No logical consistency checks

## Versioning

- **v0.2** — Current schemas match `ELANG_SPEC.md` v0.1 and `PARSER_API.md` v0.2
- Breaking changes to schemas will require a major version bump
- Extension keys (`x_*`) are reserved for future use

## See Also

- [`ELANG_SPEC.md`](../ELANG_SPEC.md) — Language specification
- [`PARSER_API.md`](../PARSER_API.md) — Parser interface
- [`ELANG.abnf`](../ELANG.abnf) — Formal grammar