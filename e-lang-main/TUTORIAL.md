# E-Lang Tutorial

A first-time user guide to understanding and using E-Lang.

**Audience:** Technically literate users, researchers, neurodivergent practitioners  
**Prerequisites:** Basic familiarity with structured data

---

## What Is E-Lang?

E-Lang is a **formal symbolic language** for representing emotional experience **prior to linguistic labeling**.

### Key Concepts

- **Representation, not interpretation** — E-Lang structures experience without naming emotions
- **Continuous, not categorical** — Values are floats, not discrete categories
- **User-authored** — You encode your own experience; it's not inferred
- **Temporal** — Captures change over time

### What Problems Does E-Lang Solve?

- **Translation pressure** — Reduces need to translate experience into emotion words
- **Neurotypical bias** — Avoids assumptions about how emotions should be categorized
- **Nuance preservation** — Maintains subtlety that gets lost in labeling
- **Temporal dynamics** — Represents change and transitions explicitly

---

## The Eight Axes

E-Lang represents states across eight continuous dimensions:

| Code | Axis | -1.0 | +1.0 |
|------|------|------|------|
| V | Valence | unpleasant | pleasant |
| A | Arousal | deactivated | activated |
| C | Agency | powerless | agentic |
| S | Safety | threatened | safe |
| K | Certainty | confused | certain |
| D | Dominance | diminished | dominant |
| B | Attachment | disconnected | bonded |
| N | Novelty | familiar | novel |

Each axis is a float in `[-1.0, +1.0]`. `0.0` means neutral, baseline, or unknown.

---

## Canonical State Vectors

The basic unit in E-Lang is a **state vector**:

```
E{V,A,C,S,K,D,B,N}
```

**Example:**
```
E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}
```

This encodes:
- V: -0.4 (slightly unpleasant)
- A: +0.7 (activated)
- C: -0.2 (slightly powerless)
- S: -0.6 (threatened)
- K: -0.1 (slightly confused)
- D: -0.3 (diminished)
- B: +0.8 (bonded)
- N: +0.2 (slightly novel)

**Important:** This is structure only. The meaning is not prescribed.

---

## Transitions (→)

Transitions represent **temporal change** from one state to another:

```
E{0,0,0,0,0,0,0,0} → E{0.5,0.3,0.2,0.1,0,0,0,0}
```

This encodes a change over time. The arrow `→` means "becomes" or "transitions to".

**Example walkthrough:**

Morning state:
```
E{-0.2,0.1,0.3,0.4,0.2,0.1,0.5,0.0}
```

Afternoon state:
```
E{0.3,0.4,0.5,0.6,0.4,0.3,0.6,0.2}
```

Transition:
```
E{-0.2,0.1,0.3,0.4,0.2,0.1,0.5,0.0} → E{0.3,0.4,0.5,0.6,0.4,0.3,0.6,0.2}
```

---

## Blends (⊕)

Blends represent **simultaneous mixture** of two states:

```
E{0.5,0.3,0.0,0.0,0.0,0.0,0.0,0.0} ⊕ E{0.2,0.1,0.4,0.0,0.0,0.0,0.0,0.0}
```

This encodes two experiences happening at the same time, combined additively.

**Example:**

Primary state:
```
E{0.3,0.2,0.1,0.0,0.0,0.0,0.0,0.0}
```

Overlapping state:
```
E{0.1,0.1,0.2,0.0,0.0,0.0,0.0,0.0}
```

Blended:
```
E{0.3,0.2,0.1,0.0,0.0,0.0,0.0,0.0} ⊕ E{0.1,0.1,0.2,0.0,0.0,0.0,0.0,0.0}
```

---

## Conflicts (⟂)

Conflicts represent **internal contradiction or tension**:

```
E{0.5,0.3,0.0,0.0,0.0,0.0,0.0,0.0} ⟂ E{-0.3,-0.2,0.0,0.0,0.0,0.0,0.0,0.0}
```

This encodes simultaneous states that contradict each other.

**Example:**

One aspect:
```
E{0.4,0.2,0.3,0.0,0.0,0.0,0.0,0.0}
```

Conflicting aspect:
```
E{-0.2,-0.1,-0.3,0.0,0.0,0.0,0.0,0.0}
```

Conflict:
```
E{0.4,0.2,0.3,0.0,0.0,0.0,0.0,0.0} ⟂ E{-0.2,-0.1,-0.3,0.0,0.0,0.0,0.0,0.0}
```

---

## Context Annotations (⊗ ctx)

Context annotations attach **environmental or situational tags**:

```
E{0.5,0.3,0.2,0.1,0.0,0.0,0.0,0.0} ⊗ ctx(workplace)
```

This encodes that the state occurs in a specific context.

**Example contexts:**
```
E{0.3,0.2,0.1,0.0,0.0,0.0,0.0,0.0} ⊗ ctx(home)
E{0.2,0.1,0.0,0.0,0.0,0.0,0.0,0.0} ⊗ ctx(social)
E{0.4,0.3,0.2,0.0,0.0,0.0,0.0,0.0} ⊗ ctx(sensory)
```

Context tags are identifiers: `[a-z0-9_-]+`

---

## Masking (mask)

Masking represents **explicit suppression or performance**:

```
mask(E{0.5,0.7,0.3,0.2,0.0,0.0,0.0,0.0}, 0.6)
```

The second value (0.6) is the **masking intensity** in range `[0.0, 1.0]`:
- `0.0` = no masking noted
- `1.0` = maximal masking effort noted

**Example:**

Reported state:
```
E{0.3,0.2,0.1,0.0,0.0,0.0,0.0,0.0}
```

With masking annotation:
```
mask(E{0.3,0.2,0.1,0.0,0.0,0.0,0.0,0.0}, 0.7)
```

This indicates that the reported state may differ from the internal state due to masking.

---

## A Simple Day Walkthrough (Synthetic Example)

Here's a synthetic example of how E-Lang might be used to structure a day's experience:

### Morning (8:00 AM)
```
E{0.2,0.1,0.4,0.5,0.3,0.2,0.6,0.1}
```
Encodes: slight positive valence, low activation, moderate agency, moderate safety, slight certainty, slight dominance, moderate attachment, low novelty.

### Mid-Morning (10:30 AM)
```
E{0.2,0.1,0.4,0.5,0.3,0.2,0.6,0.1} → E{0.1,0.3,0.3,0.4,0.2,0.1,0.5,0.3}
```
Transition: activation increases slightly, safety decreases slightly, novelty increases.

### Afternoon (2:00 PM)
```
E{0.1,0.3,0.3,0.4,0.2,0.1,0.5,0.3} → E{0.4,0.5,0.6,0.7,0.5,0.4,0.7,0.2}
```
Transition: multiple axes shift toward positive values.

### Evening (6:00 PM)
```
E{0.4,0.5,0.6,0.7,0.5,0.4,0.7,0.2} → E{0.3,0.2,0.5,0.8,0.6,0.5,0.8,0.1}
```
Transition: activation decreases, safety and attachment increase.

### With Context
```
E{0.3,0.2,0.5,0.8,0.6,0.5,0.8,0.1} ⊗ ctx(home)
```
Evening state annotated with home context.

### With Masking
```
mask(E{0.3,0.2,0.5,0.8,0.6,0.5,0.8,0.1} ⊗ ctx(home), 0.3)
```
Evening state with context and masking annotation.

---

## Corresponding AST Examples

When parsed, E-Lang expressions become Abstract Syntax Trees (ASTs). Here's what the structure looks like:

### Simple State AST
```
State(values=[0.2, 0.1, 0.4, 0.5, 0.3, 0.2, 0.6, 0.1])
```

### Transition AST
```
BinaryOp(
  op='→',
  left=State(values=[0.2, 0.1, 0.4, 0.5, 0.3, 0.2, 0.6, 0.1]),
  right=State(values=[0.1, 0.3, 0.3, 0.4, 0.2, 0.1, 0.5, 0.3])
)
```

### Context AST
```
BinaryOp(
  op='⊗',
  left=State(values=[0.3, 0.2, 0.5, 0.8, 0.6, 0.5, 0.8, 0.1]),
  right=Context(tag='home')
)
```

### Mask AST
```
MaskCall(
  expr=State(values=[0.3, 0.2, 0.5, 0.8, 0.6, 0.5, 0.8, 0.1]),
  value=0.3
)
```

---

## Operator Precedence

When combining operators, precedence matters:

1. `mask()` — Highest precedence
2. `⊗ ctx()` — Context modulation
3. `⊕` and `⟂` — Blend and conflict (same level)
4. `→` — Transition (lowest precedence)

**Example:**
```
mask(E{0,0,0,0,0,0,0,0} ⊗ ctx(work) ⊕ E{0,0,0,0,0,0,0,0}, 0.5)
```

This is parsed as:
- First: `E{0,0,0,0,0,0,0,0} ⊗ ctx(work)` (context binds tightest)
- Then: `(...) ⊕ E{0,0,0,0,0,0,0,0}` (blend)
- Finally: `mask(..., 0.5)` (mask applies to the whole blend)

Use parentheses to override precedence:
```
(mask(E{0,0,0,0,0,0,0,0}, 0.5) → E{0,0,0,0,0,0,0,0}) ⊕ E{0,0,0,0,0,0,0,0}
```

---

## What E-Lang Does NOT Do

- **No emotion labels** — E-Lang doesn't name what you're feeling
- **No interpretation** — It structures, doesn't explain
- **No evaluation** — It doesn't compute or normalize expressions
- **No inference** — States must be explicitly authored
- **No diagnosis** — Not a clinical or therapeutic tool

---

## Next Steps

- Read [`ELANG_SPEC.md`](ELANG_SPEC.md) for complete grammar
- See [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md) for tooling
- Check [`JOURNAL_TEMPLATE.md`](JOURNAL_TEMPLATE.md) for journaling patterns
- Review [`ELANG_MACROS.md`](ELANG_MACROS.md) for reusable patterns

---

**E-Lang is infrastructure for representation, not instruction for interpretation.**