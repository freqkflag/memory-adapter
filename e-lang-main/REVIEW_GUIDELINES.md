# E-Lang Review Guidelines

Guidelines for providing feedback on E-Lang without opening scope or destabilizing the language.

**Purpose:** Enable external feedback while maintaining project boundaries and stability.

---

## What Feedback Is Welcome

We welcome feedback that helps improve:

### Documentation Clarity
- Unclear explanations in README, tutorials, or guides
- Missing examples or use cases
- Confusing API documentation
- Ambiguous terminology

**Example:** "The tutorial doesn't explain how to handle nested expressions."

### Tooling Bugs
- Parser errors on valid syntax
- Schema validation failures on correct data
- CLI tool crashes or incorrect output
- Test failures

**Example:** "The formatter changes the meaning of my expression."

### Specification Misunderstandings
- Questions about grammar interpretation
- Uncertainty about operator behavior
- Confusion about axis definitions
- Requests for clarification of existing features

**Example:** "I'm not sure how operator precedence works with parentheses."

### Usability Issues
- Difficult installation or setup
- Unclear error messages
- Missing validation feedback
- Confusing tool output

**Example:** "The error message doesn't tell me which axis is out of range."

---

## What Feedback Is Out of Scope

We **cannot accept** feedback that requests:

### Core Grammar Changes
- New axes or reordered axes
- New operators
- Modified operator precedence
- Changes to canonical syntax

**Why:** Grammar is frozen in v0.1. Changes require major version bump and community discussion.

**Example (out of scope):** "Can we add a new axis for X?"

### Semantic Interpretation
- Emotion labeling or taxonomies
- Expression evaluation or computation
- Meaning extraction or inference
- Emotional scoring or categorization

**Why:** E-Lang separates representation from interpretation. Interpretation belongs in application layers.

**Example (out of scope):** "Can the parser tell me what emotion this represents?"

### Clinical or Diagnostic Features
- Diagnostic capabilities
- Therapeutic protocols
- Clinical assessments
- Medical or health claims

**Why:** E-Lang is infrastructure, not a medical or therapeutic tool.

**Example (out of scope):** "Can E-Lang diagnose emotional disorders?"

### Evaluation or Normalization
- Expression simplification
- Operator result computation
- Automatic normalization
- Semantic optimization

**Why:** E-Lang preserves structure as-authored. Evaluation is not part of the language.

**Example (out of scope):** "Can the parser simplify redundant expressions?"

---

## How Feedback Is Categorized

When feedback is received, it will be categorized as:

### Documentation Clarification
- **Action:** Update documentation, add examples, clarify wording
- **Timeline:** As resources allow
- **Scope:** Documentation only, no code changes

### Tooling Bug
- **Action:** Fix bug in parser, validator, or tools
- **Timeline:** Based on severity and maintainer availability
- **Scope:** Bug fixes only, no feature additions

### Specification Misunderstanding
- **Action:** Clarify existing specification or grammar
- **Timeline:** Documentation update
- **Scope:** Explanation only, no spec changes

### Out-of-Scope Request
- **Action:** Acknowledge, explain why it's out of scope, suggest alternatives if applicable
- **Timeline:** Response only, no implementation
- **Scope:** No changes

---

## Response Posture

### Acknowledgment
All feedback is acknowledged, even if out of scope.

### Boundaries
We clearly explain why certain requests are out of scope, referencing:
- `AGENTS.md` — Project scope and constraints
- `ELANG_SPEC.md` — Grammar freeze and stability
- `CONTRIBUTING.md` — Contribution guidelines

### Alternatives
When appropriate, we suggest:
- Extension mechanisms (`x_*` namespaced fields)
- External tooling or application layers
- Community discussion for major changes

### No Promises
We do not commit to:
- Timeline for addressing feedback
- Implementation of requested features
- Scope expansion or grammar changes

---

## Feedback Channels

### GitHub Issues
- Use for: Bugs, documentation issues, questions
- Template: See `FEEDBACK_TEMPLATE.md`
- Response: Within reasonable timeframe (no SLA)

### Discussions
- Use for: Questions, use cases, community conversation
- Response: Community-driven, maintainer participation as available

### Pull Requests
- Use for: Documentation fixes, bug fixes (with maintainer approval)
- Process: See `CONTRIBUTING.md`
- Scope: Must not modify grammar, semantics, or core behavior

---

## What Happens to Feedback

1. **Acknowledged** — Feedback is read and categorized
2. **Triaged** — Assigned to appropriate category (documentation, bug, out-of-scope)
3. **Responded** — Maintainer provides response explaining next steps or boundaries
4. **Acted on** (if applicable) — Documentation updates or bug fixes as resources allow

**Not all feedback results in changes.** Some feedback helps us understand usage patterns without requiring implementation.

---

## Examples

### Welcome Feedback

**"The tutorial doesn't show how to use macros."**
- Category: Documentation clarification
- Action: Add macro examples to tutorial
- Timeline: Next documentation update

**"The parser crashes on this valid expression: E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}"**
- Category: Tooling bug
- Action: Investigate and fix parser bug
- Timeline: Based on severity

**"I'm confused about when to use ⊕ vs ⟂."**
- Category: Specification misunderstanding
- Action: Clarify operator semantics in documentation
- Timeline: Documentation update

### Out-of-Scope Feedback

**"Can we add a new axis for physical sensations?"**
- Response: "New axes require grammar changes, which are frozen in v0.1. This would require a major version bump and community discussion. For now, you can use `x_*` namespaced extension fields in JSON to attach additional data."

**"Can the parser tell me what emotion this state represents?"**
- Response: "E-Lang does not provide semantic interpretation. The parser validates structure only. Interpretation (mapping to emotion words) belongs in application layers, not the language itself."

**"Can E-Lang be used for diagnosing emotional disorders?"**
- Response: "E-Lang is infrastructure for representation, not a diagnostic tool. It is explicitly out of scope for clinical diagnosis. See `AGENTS.md` and `ELANG_SPEC.md` for scope boundaries."

---

## See Also

- [`FEEDBACK_TEMPLATE.md`](FEEDBACK_TEMPLATE.md) — Structured feedback form
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Contribution process
- [`AGENTS.md`](AGENTS.md) — Project scope and constraints
- [`ELANG_SPEC.md`](ELANG_SPEC.md) — Language specification

---

**Feedback helps us improve. Boundaries help us stay stable.**