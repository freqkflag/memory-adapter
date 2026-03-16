# Simulated External Review Example

This document demonstrates how external feedback would be handled according to `REVIEW_GUIDELINES.md`.

**Status:** Illustrative example only. No actual changes result from this simulation.

---

## Example 1: Welcome Feedback — Documentation Clarification

### External Feedback Submission

**What were you trying to do?**
I was learning E-Lang and trying to understand how to use the blend operator (⊕) in practice.

**What part of the project were you using?**
- [x] Documentation (TUTORIAL.md)
- [x] Parser (`elang_parser/`)

**What worked as expected?**
The parser successfully parsed blend expressions.

**What was unclear or confusing?**
The tutorial shows the syntax `E{...} ⊕ E{...}` but doesn't explain when you would use blending vs. transitions. Are they for different scenarios?

**Feedback category:**
- [x] Documentation clarification needed

**Scope acknowledgment:**
- [x] I understand that E-Lang does **not** provide semantic interpretation
- [x] I understand that E-Lang does **not** evaluate expressions
- [x] I understand that grammar changes are frozen
- [x] I understand that E-Lang is **not** a diagnostic tool
- [x] My feedback is about existing functionality

---

### Maintainer Response

**Status:** Acknowledged — Documentation clarification

**Response:**

Thank you for the feedback. This is a valid documentation gap.

**Clarification:**

- **Blend (⊕):** Represents simultaneous mixture of two states occurring at the same time
- **Transition (→):** Represents temporal change from one state to another over time

The choice between them depends on what you're representing:
- Use `→` when encoding a change over time (state A becomes state B)
- Use `⊕` when encoding two simultaneous experiences (state A and state B happening together)

**Action:**

We'll add a clearer explanation to `TUTORIAL.md` distinguishing when to use each operator, with examples showing the difference.

**Timeline:**

Documentation update in next maintenance cycle (no committed date).

**No grammar or parser changes required.** This is purely a documentation clarification.

---

## Example 2: Out-of-Scope Request — New Feature

### External Feedback Submission

**What were you trying to do?**
I want to add a new axis for physical sensations (like temperature, pressure) to better represent my experience.

**What part of the project were you using?**
- [x] Specification (`ELANG_SPEC.md`)
- [x] Grammar (`ELANG.abnf`)

**What worked as expected?**
The existing 8 axes work, but I need more dimensions.

**What was unclear or confusing?**
How do I add a new axis?

**Feedback category:**
- [ ] Other: Feature request

**Scope acknowledgment:**
- [ ] I understand that grammar changes are frozen

---

### Maintainer Response

**Status:** Acknowledged — Out of scope

**Response:**

Thank you for the feedback. We understand the desire for additional axes.

**Why this is out of scope:**

The axis set `V,A,C,S,K,D,B,N` is frozen in v0.1. Adding new axes would require:
1. Grammar changes to `ELANG.abnf`
2. Specification updates to `ELANG_SPEC.md`
3. Parser modifications
4. Breaking changes to existing implementations
5. Major version bump (v1.0)

This is beyond the scope of current maintenance.

**Alternatives:**

1. **Use extension fields:** In JSON, you can attach additional data using `x_*` namespaced keys:
   ```json
   {
     "V": 0.0,
     "A": 0.0,
     ...
     "N": 0.0,
     "x_physical": {
       "temperature": 0.5,
       "pressure": 0.3
     }
   }
   ```

2. **External metadata:** Attach physical sensation data outside the E-Lang expression in your application layer.

3. **Community discussion:** If there's sufficient community interest, we could discuss a major version change, but this would require extensive community input and would not happen in the near term.

**Action:**

No implementation. This request is documented for future consideration if community interest develops.

**See also:**

- [`EXTENSIONS.md`](EXTENSIONS.md) — Extension practices
- [`REVIEW_GUIDELINES.md`](REVIEW_GUIDELINES.md) — What feedback is welcome

---

## Example 3: Tooling Bug

### External Feedback Submission

**What were you trying to do?**
I was using the formatter tool to format an expression, but it changed the values.

**What part of the project were you using?**
- [x] Reference tools (`tools/format_expr.py`)

**What worked as expected?**
The tool ran without errors.

**What was unclear or confusing?**
Input: `E{0.5,0.3,0.2,0.1,0,0,0,0}`
Output: `E{+0.5,+0.3,+0.2,+0.1,0,0,0,0}`

The formatter added `+` signs. Is this correct? It seems like it's changing the expression.

**Feedback category:**
- [x] Tooling bug

**Scope acknowledgment:**
- [x] I understand that E-Lang does **not** provide semantic interpretation
- [x] I understand that E-Lang does **not** evaluate expressions
- [x] My feedback is about existing functionality

---

### Maintainer Response

**Status:** Acknowledged — Tooling bug (or clarification)

**Response:**

Thank you for reporting this. Let me clarify the behavior.

**Analysis:**

The formatter is adding `+` signs to positive numbers. According to `ELANG_SPEC.md` section 3.3, "A leading `+` is allowed and recommended for readability." The formatter is applying this recommendation.

**However:**

If this is causing confusion or breaking round-trip expectations, we should review the formatter behavior.

**Action:**

1. Verify that the formatted output parses back to the same AST structure (round-trip test)
2. If round-trip is preserved, this is working as intended (formatting for readability)
3. If round-trip is broken, this is a bug and will be fixed
4. Consider making the `+` sign addition optional or configurable

**Timeline:**

Investigation within next maintenance cycle. Fix (if needed) in following cycle.

**No parser or grammar changes.** This is a tooling behavior question.

---

## Example 4: Specification Misunderstanding

### External Feedback Submission

**What were you trying to do?**
I was trying to understand if E-Lang can tell me what emotion a state represents.

**What part of the project were you using?**
- [x] Documentation (TUTORIAL.md, README.md)
- [x] Specification (`ELANG_SPEC.md`)

**What worked as expected?**
I can parse states successfully.

**What was unclear or confusing?**
The documentation says E-Lang represents emotion, but I can't figure out how to get emotion labels from a state. Is there a function I'm missing?

**Feedback category:**
- [x] Specification misunderstanding

**Scope acknowledgment:**
- [ ] I understand that E-Lang does **not** provide semantic interpretation

---

### Maintainer Response

**Status:** Acknowledged — Specification misunderstanding

**Response:**

Thank you for the question. This is an important clarification.

**Clarification:**

E-Lang does **not** provide emotion labels or semantic interpretation. This is by design.

**What E-Lang does:**
- Structures emotional experience as vectors
- Provides syntax for representing states and changes
- Validates structure and syntax

**What E-Lang does NOT do:**
- Map states to emotion words
- Interpret what states "mean"
- Provide emotion labels or categories
- Evaluate or compute emotional meaning

**Why:**

E-Lang separates **representation** from **interpretation**. The language provides the structure; interpretation (emotion words, needs, narratives) belongs in application layers, not the language itself.

**If you need emotion labels:**

You would implement this in your application:
1. Parse E-Lang expression to get structure
2. Apply your own interpretation layer (mapping patterns to labels)
3. This interpretation is separate from E-Lang

**Action:**

We'll add a clearer statement to `TUTORIAL.md` and `README.md` emphasizing that E-Lang does not provide interpretation, with examples of how interpretation would be handled in application layers.

**Timeline:**

Documentation update in next maintenance cycle.

**No code changes.** This is a documentation clarification.

---

## Summary of Response Patterns

### Welcome Feedback
- **Acknowledge** the feedback
- **Categorize** appropriately
- **Clarify** or **fix** as applicable
- **Set expectations** about timeline (no promises)

### Out-of-Scope Feedback
- **Acknowledge** the feedback
- **Explain** why it's out of scope (reference `AGENTS.md`, `ELANG_SPEC.md`)
- **Suggest alternatives** if applicable (extensions, external tooling)
- **Document** for future consideration if appropriate

### All Feedback
- **Respectful** tone
- **Clear boundaries** (not defensive)
- **No promises** about implementation
- **Reference** authoritative documents

---

**This simulation demonstrates the review process. Actual feedback will be handled according to these patterns.**