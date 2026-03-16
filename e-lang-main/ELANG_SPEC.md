# E-Lang v0 Specification

**E-Lang** is a formal symbolic language for representing emotional experience **prior to linguistic labeling**. It is designed to reduce neurotypical bias in emotional reporting and to support neurodivergent modes of sense-making.

E-Lang is **not** a diagnostic tool, emotion taxonomy, therapeutic protocol, or automated inference system.

---

## 1. Core Concepts

E-Lang separates **representation** from **interpretation**:

- **Representation:** structured, continuous description of state and change
- **Interpretation:** optional translation into emotion words, needs, or narratives

The canonical unit is an **emotional state vector** over fixed axes, plus a grammar for composition and transitions.

---

## 2. Primitives (Axes)

Each axis is a float in the closed interval **[-1.0, +1.0]**.  
`0.0` denotes neutral / baseline / unknown.

| Code | Axis (Canonical) | -1.0 | +1.0 |
|---|---|---|---|
| V | Valence | unpleasant | pleasant |
| A | Arousal | deactivated | activated |
| C | Agency | powerless | agentic |
| S | Safety | threatened | safe |
| K | Certainty | confused | certain |
| D | Dominance | diminished | dominant |
| B | Attachment | disconnected | bonded |
| N | Novelty | familiar | novel |

**Terminology:** Axis `C` is canonically named **Agency**. "Control" may be used as a legacy alias meaning perceived agency.

**Axis Reference Key (Non-Normative):** For operational definitions and usage guidance for each axis, see [`AXIS_KEY.md`](AXIS_KEY.md).

---

## 3. Canonical State Syntax (Ordered Vector)

### 3.1 Required axis order

The canonical human-readable representation is an **ordered vector** with fixed axis order:

`E{V,A,C,S,K,D,B,N}`

### 3.2 Example

`E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}`

### 3.3 Value constraints

- Each component MUST be a decimal float in `[-1.0, +1.0]`
- A leading `+` is allowed and recommended for readability
- Implementations SHOULD clamp out-of-range values only when explicitly configured; otherwise treat as invalid input

---

## 4. Equivalent Machine Serialization (Key–Value)

For interchange/storage, an equivalent key–value form MAY be used:

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

**Rules:**
- Key order is not significant
- Missing keys default to `0.0`
- Extra keys are invalid unless explicitly namespaced extension keys (see Extensions)

---

## 5. Expressions and Operators

E-Lang supports representing change, blending, conflict, and context modulation.

### 5.1 Operators

| Operator | Name | Meaning |
|---|---|---|
| `→` | Transition | temporal change from one expression to another |
| `⊕` | Blend | simultaneous mixture of expressions |
| `⟂` | Conflict | internal contradiction/tension between expressions |
| `⊗` | Context modulation | apply a context tag to an expression |
| `mask(E,m)` | Masking | annotate expression with masking intensity (0–1) |

### 5.2 Operator precedence (highest → lowest)

1. `mask(expr, m)`
2. `expr ⊗ ctx(tag)`
3. `expr ⊕ expr` and `expr ⟂ expr`
4. `expr → expr`

**Associativity:**
- `⊕` and `⟂` are left-associative
- `→` is left-associative (a trajectory)

---

## 6. Context Tags

Context tags are annotations, not axes. Use:

```
expr ⊗ ctx(work)
expr ⊗ ctx(home)
expr ⊗ ctx(sensory)
```

Tags are lowercase identifiers `[a-z0-9_-]+` by default.

---

## 7. Masking Annotation

Masking is modeled as explicit, self-reported annotation:

```
mask(expr, m)
```

Where:
- `m` is a float in `[0.0, 1.0]`
- `0.0` means no masking/performance effort noted
- `1.0` means maximal masking/performance effort noted

---

## 8. Semantics (Optional, Non-Normative)

E-Lang does not require interpretation. However, applications MAY implement a semantic layer that maps patterns to needs rather than labels.

**Example (non-normative):**
- Alarm signature: `A ≥ 0.6` and `S ≤ -0.5`
- Shutdown signature: `A ≤ -0.5` and `C ≤ -0.4` and `V ≤ -0.4`

---

## 9. Extensions

Extensions MUST be namespaced to avoid collisions.

**Examples:**
- KV form may include `"x_body": {...}` or `"x_urge": {...}`
- Context tags may include structured forms: `ctx(work:meeting)` (optional extension)

Implementations SHOULD ignore unknown extension keys if configured, otherwise treat as invalid.

---

## 10. Conformance

An implementation is E-Lang v0 conformant if it:
- Parses canonical state syntax `E{V,A,C,S,K,D,B,N}` with axis order enforced
- Enforces value ranges for axes and mask
- Parses operators with defined precedence and associativity
- Supports `ctx(tag)` in `⊗` and `mask(expr,m)`
- Round-trips canonical ordered vector form without reordering or dropping components
