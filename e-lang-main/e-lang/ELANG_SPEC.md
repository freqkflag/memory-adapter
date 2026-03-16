# E-Lang v0 Specification

## Purpose
E-Lang is a formal symbolic language for representing emotional experience prior to linguistic labeling. It is designed to reduce neurotypical bias in emotional reporting and to support neurodivergent modes of sense-making.

E-Lang is not a taxonomy of emotions, a diagnostic tool, or a therapeutic protocol.

## Formal Syntax and Encoding Rules

### Canonical State Form (Ordered Vector)

The canonical representation of an emotional state is an ordered vector with fixed axis order:

E{V,A,C,S,K,D,B,N}

Where each value is a float in the closed interval [-1.0, +1.0].

Example:
E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}

This ordered form is normative for human-readable notation and comparison.

### Equivalent Key-Value Serialization (Machine Form)

For storage and interchange, an equivalent key-value encoding MAY be used:

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

Key order is not significant in this form. Missing keys default to 0.0.

### Operators and Precedence

Operator precedence (highest -> lowest):
1. mask(E,m)
2. ⊗ ctx(x)
3. ⊕  ⟂
4. →

## Emotional Primitives
All axes range from -1.0 to +1.0.

| Code | Axis | -1 | +1 |
|---|---|---|---|
| V | Valence | unpleasant | pleasant |
| A | Arousal | deactivated | activated |
| C | Agency | powerless | agentic |
| S | Safety | threatened | safe |
| K | Certainty | confused | certain |
| D | Dominance | diminished | dominant |
| B | Attachment | disconnected | bonded |
| N | Novelty | familiar | novel |

Note: Axis C is canonically named Agency. "Control" is treated as a legacy alias
referring to perceived agency rather than external constraint.
