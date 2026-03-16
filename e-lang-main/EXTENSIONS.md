# E-Lang Extension Practices

Guidelines for safely extending E-Lang without modifying core grammar or semantics.

**Audience:** Contributors, downstream system designers, tool builders  
**Goal:** Enable extensions while preserving compatibility and clarity

---

## Philosophy

E-Lang extensions follow a **namespacing and separation** principle:

- **Core grammar is frozen** — No changes to syntax, operators, or axes
- **Extensions are external** — Attached via namespaced fields, not core syntax
- **Backward compatibility** — Extensions must not break existing implementations
- **Explicit opt-in** — Extensions are visible and optional

---

## Extension Mechanisms

### JSON State Extensions: `x_*` Namespace

The state JSON Schema allows `x_*` prefixed keys for extensions:

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
  },
  "x_metadata": {
    "source": "app_v1.2",
    "timestamp": "2026-01-26T10:00:00Z"
  }
}
```

**Rules:**
- Keys must start with `x_`
- Values can be any JSON type
- Implementations should ignore unknown `x_*` keys
- Extensions must not modify core axis values

### External Metadata Attachment

Attach metadata **outside** the E-Lang expression:

```json
{
  "elang_state": {
    "V": 0.0,
    "A": 0.0,
    "C": 0.0,
    "S": 0.0,
    "K": 0.0,
    "D": 0.0,
    "B": 0.0,
    "N": 0.0
  },
  "metadata": {
    "author": "user_123",
    "timestamp": "2026-01-26T10:00:00Z",
    "context_notes": "Additional context"
  }
}
```

This keeps E-Lang data separate from application metadata.

---

## Acceptable Extensions

### ✅ Metadata Extensions

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
  "x_source": "mobile_app_v2.1",
  "x_timestamp": "2026-01-26T10:00:00Z",
  "x_device": "ios"
}
```

### ✅ Annotation Extensions

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
  "x_tags": ["work", "morning"],
  "x_notes": "User-provided annotation"
}
```

### ✅ Structured Extension Data

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
  "x_body": {
    "heart_rate": 72,
    "temperature": 36.5
  }
}
```

---

## Unacceptable Extensions

### ❌ Core Grammar Changes

**Do NOT:**
- Add new axes (e.g., `"X": 0.0` as a core axis)
- Modify operator syntax
- Change axis order or names
- Add new operators to core grammar

**Why:** Core grammar is frozen. Changes require major version bump and community discussion.

### ❌ Semantic Interpretation Fields

**Do NOT:**
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
  "emotion_label": "happy",  // ❌ Interpretation
  "meaning": "...",          // ❌ Interpretation
  "evaluation": "..."        // ❌ Evaluation
}
```

**Why:** E-Lang separates representation from interpretation. Interpretation belongs in application layers, not core data.

### ❌ Modifying Core Values

**Do NOT:**
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
  "V_normalized": 0.5,  // ❌ Don't add normalized versions
  "computed_score": 0.3  // ❌ Don't add computed values
}
```

**Why:** Core values are user-authored. Computed or normalized values should be separate.

---

## Proposing Core Changes

If you need functionality that requires core grammar changes:

### Process

1. **Open an issue** describing:
   - What problem you're solving
   - Why extensions aren't sufficient
   - Proposed grammar change
   - Impact on existing code

2. **Community discussion** — Core changes require:
   - Clear justification
   - Backward compatibility analysis
   - Migration path if breaking

3. **Specification update** — If approved:
   - Update `ELANG_SPEC.md`
   - Update `ELANG.abnf`
   - Major version bump

### Examples of Core Changes

These would require the process above:
- Adding a new axis
- Changing axis order
- Adding a new operator
- Modifying operator precedence
- Changing canonical syntax

---

## Extension Best Practices

### 1. Use Descriptive Names

```json
{
  "x_app_version": "2.1.0",           // ✅ Clear
  "x": "2.1.0"                        // ❌ Unclear
}
```

### 2. Document Your Extensions

If you use `x_*` keys, document them:

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
  "x_myapp_sensor": {
    "_documentation": "https://myapp.com/docs/extensions",
    "data": {...}
  }
}
```

### 3. Version Your Extensions

```json
{
  "x_myapp_v1": {...},
  "x_myapp_v2": {...}  // New version, old still supported
}
```

### 4. Keep Extensions Optional

Implementations should work without extensions:

```python
def process_state(state_data):
    # Process core axes
    core_axes = {k: v for k, v in state_data.items() 
                 if k in ['V', 'A', 'C', 'S', 'K', 'D', 'B', 'N']}
    
    # Optionally process extensions
    extensions = {k: v for k, v in state_data.items() 
                  if k.startswith('x_')}
    
    if 'x_myapp' in extensions:
        # Handle extension
        pass
```

---

## Extension Examples

### Example 1: Application Metadata

```json
{
  "V": 0.3,
  "A": 0.2,
  "C": 0.1,
  "S": 0.4,
  "K": 0.2,
  "D": 0.1,
  "B": 0.5,
  "N": 0.1,
  "x_app": {
    "name": "MyJournalApp",
    "version": "1.0.0",
    "entry_id": "entry_12345"
  }
}
```

### Example 2: Sensor Data

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
  "x_sensors": {
    "heart_rate": 72,
    "skin_conductance": 2.5,
    "note": "Sensor data for correlation, not interpretation"
  }
}
```

### Example 3: Research Annotations

```json
{
  "V": 0.2,
  "A": 0.3,
  "C": 0.1,
  "S": 0.4,
  "K": 0.2,
  "D": 0.1,
  "B": 0.5,
  "N": 0.1,
  "x_research": {
    "study_id": "study_2026_001",
    "participant_id": "p_123",
    "session": 3,
    "condition": "baseline"
  }
}
```

---

## Handling Extensions in Code

### Ignore Unknown Extensions

```python
def process_state(state_data):
    # Extract core axes
    core = {k: v for k, v in state_data.items() 
            if k in ['V', 'A', 'C', 'S', 'K', 'D', 'B', 'N']}
    
    # Extract known extensions
    known_extensions = {}
    for key, value in state_data.items():
        if key.startswith('x_'):
            if key in ['x_app', 'x_metadata']:  # Known extensions
                known_extensions[key] = value
            # Unknown x_* keys are silently ignored
    
    return core, known_extensions
```

### Validate Extension Structure

```python
import jsonschema

# Define your extension schema
extension_schema = {
    "type": "object",
    "properties": {
        "x_myapp": {
            "type": "object",
            "properties": {
                "version": {"type": "string"},
                "entry_id": {"type": "string"}
            }
        }
    }
}

# Validate
jsonschema.validate(instance=state_data, schema=extension_schema)
```

---

## Backward Compatibility

### Extensions Must Not Break Core

- Core parsers should ignore `x_*` keys
- Core validation should pass with extensions present
- Core serialization should preserve extensions

### Migration Paths

If you need to change extension structure:

```json
// Old extension
{
  "x_myapp_data": {...}
}

// New extension (additive)
{
  "x_myapp_data": {...},  // Keep for compatibility
  "x_myapp_v2": {...}     // New structure
}
```

---

## See Also

- [`ELANG_SPEC.md`](ELANG_SPEC.md) section 9 — Extensions
- [`elang_state.schema.json`](elang_state.schema.json) — Schema with extension support
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Contribution process

---

**Extensions enable flexibility; core grammar ensures compatibility.**