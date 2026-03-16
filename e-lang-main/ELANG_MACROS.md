# E-Lang Macro Library (v0)

Macros are reusable **vector bundles** and shorthand **expression fragments**.
They are **not** emotion labels; they expand to E-Lang primitives.

---

## 1. Macro Definitions (JSON)

```json
{
  "ALARM":     {"A": 0.8, "S": -0.8},
  "CALM":      {"A": -0.6, "S": 0.6},
  "BOND":      {"B": 0.8},
  "DETACH":    {"B": -0.6},
  "AGENCY":    {"C": 0.7},
  "CONFUSION": {"K": -0.7},
  "CLARITY":   {"K": 0.7},
  "SHUTDOWN":  {"A": -0.7, "V": -0.5, "C": -0.6},
  "DRIVE":     {"A": 0.6, "C": 0.6, "V": 0.3},
  "LOSS":      {"V": -0.6, "B": 0.6, "S": -0.4}
}
```

---

## 2. Expansion Rule

A macro expands into a partial vector update on an existing state.

**Example (conceptual):**
- Start: `E{0,0,0,0,0,0,0,0}`
- Apply `ALARM`: set/adjust `A` and `S`
- Apply `BOND`: set/adjust `B`

**Implementations MAY choose:**
- **Set semantics:** overwrite listed axes
- **Add semantics:** add values and clamp to `[-1,1]`
- **Mix semantics:** weighted blend

If you implement macros programmatically, pick one semantics and document it.

**Recommended default for v0 tooling:**
- Add semantics with clamp

---

## 3. Expression Examples

### 3.1 Blend

```
(ALARM ⊕ BOND)
```

### 3.2 Trajectory

```
(ALARM ⊕ BOND) → (CALM ⊕ AGENCY)
```

### 3.3 Context + masking

```
mask((ALARM ⊕ BOND) ⊗ ctx(work), 0.7)
```

---

## 4. Customization

You can create personal macros for recurring configurations. Keep names:
- Short
- Uppercase
- Single concept bundle

Store new macros in a separate block (e.g., `ELANG_MACROS_PERSONAL.json`) to avoid breaking shared defaults.
