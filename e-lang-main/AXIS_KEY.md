# E-Lang Axis Key (Non-Normative Reference)

**Status:** Non-normative reference  
**Scope:** Clarifies operational usage only  
**Versioning:** Clarifications only; no semantic expansion

This document provides operational definitions for the eight E-Lang axes. It clarifies structural usage without introducing interpretation, labels, or evaluation.

---

## Canonical Use Rules

- **Axes are independent** — Each axis measures a distinct dimension. Values on one axis do not constrain values on others.
- **No axis is good/bad** — All values are valid representations. There are no normative targets or optimal ranges.
- **Conflict across axes is expected** — Simultaneous high and low values across different axes is a valid representation of complex experience.
- **Precision is not required** — Approximate values are acceptable. Exact precision is not necessary for meaningful representation.
- **Interpretation is out of scope** — This key describes what axes measure structurally, not what they mean semantically.

---

## Axis Definitions

### V — Valence

**What this axis measures:**
The structural dimension from unpleasant experience toward pleasant experience.

**What this axis does NOT measure:**
- Emotional labels (e.g., "happy", "sad")
- Moral judgment (good/bad)
- Preference ranking
- Hedonic value in isolation from other axes

**Guiding question:**
How would you position this experience on a continuum from unpleasant to pleasant?

---

### A — Arousal

**What this axis measures:**
The structural dimension from deactivated/low activation toward activated/high activation.

**What this axis does NOT measure:**
- Energy level as a separate concept
- Attention or focus (though it may correlate)
- Stress or pressure (though it may correlate)
- Physical activity level

**Guiding question:**
How would you position this experience on a continuum from deactivated to activated?

---

### C — Control / Agency

**What this axis measures:**
The structural dimension from powerless/lack of control toward having control/agency.

**What this axis does NOT measure:**
- Agency as distinct from control (Agency may be mentioned as an alias)
- Competence or skill level
- Responsibility or blame
- Autonomy in isolation from context

**Guiding question:**
How would you position this experience on a continuum from powerless to having control?

---

### S — Social Orientation

**What this axis measures:**
The structural dimension of social orientation and relational positioning.

**What this axis does NOT measure:**
- Safety or threat (though it may correlate)
- Social acceptance or belonging as distinct concepts
- Relationship quality or health
- Interpersonal closeness in isolation

**Guiding question:**
How would you position this experience on a continuum of social orientation?

---

### K — Cognitive Load

**What this axis measures:**
The structural dimension of cognitive processing load and mental effort.

**What this axis does NOT measure:**
- Certainty or confusion (though it may correlate)
- Knowledge or information level
- Clarity of thought as distinct from cognitive load
- Understanding or comprehension

**Guiding question:**
How would you position this experience on a continuum of cognitive load?

---

### D — Distress

**What this axis measures:**
The structural dimension of distress level and discomfort intensity.

**What this axis does NOT measure:**
- Dominance or power (though it may correlate)
- Social status or hierarchy position
- Assertiveness or aggression
- Emotional labels (e.g., "anxious", "sad")

**Guiding question:**
How would you position this experience on a continuum of distress?

---

### B — Body State

**What this axis measures:**
The structural dimension of bodily sensation and physical state.

**What this axis does NOT measure:**
- Attachment or connection (though it may correlate)
- Relationship quality or health
- Physical health or medical conditions
- Emotional labels tied to body sensations

**Guiding question:**
How would you position this experience on a continuum of body state?

---

### N — Novelty

**What this axis measures:**
The structural dimension from familiar/known toward novel/unknown.

**What this axis does NOT measure:**
- Surprise or shock as emotional labels
- Information entropy or unpredictability
- Change or transition (use operators for temporal change)
- Stimulation level (though it may correlate)

**Guiding question:**
How would you position this experience on a continuum from familiar to novel?

---

## Value Range

All axes use the closed interval **[-1.0, +1.0]**:
- `-1.0` represents the structural pole at the negative end
- `+1.0` represents the structural pole at the positive end
- `0.0` represents neutral, baseline, or unknown

Values are continuous. There are no thresholds, categories, or breakpoints.

---

## See Also

- [`ELANG_SPEC.md`](ELANG_SPEC.md) — Formal language specification
- [`ELANG.abnf`](ELANG.abnf) — Grammar definition
- [`PARSER_API.md`](PARSER_API.md) — Parser interface

---

**This key is operational, not interpretive. It describes structure, not meaning.**