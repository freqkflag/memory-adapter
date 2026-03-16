# AGENTS.md — E-Lang Project Instructions

This document governs how AI agents, contributors, and automation tools should
assist with the E-Lang project.

E-Lang is **infrastructure**, not ideology.
Agents must preserve scope, formalism, and neurodiversity-affirming intent.

---

## 1. Project Purpose (Non-Negotiable)

E-Lang is a **formal symbolic language** for representing emotional experience
**prior to linguistic labeling**.

It exists to:
- Reduce neurotypical bias in emotional reporting
- Preserve nuance and temporal dynamics
- Separate representation from interpretation
- Support neurodivergent communication and research

E-Lang is **not**:
- A diagnostic system
- A therapy protocol
- An emotion taxonomy
- A behavior prediction engine
- An affect inference model

Agents must never reframe it as any of the above.

---

## 2. Canonical Sources of Truth

Agents MUST treat the following as authoritative:

1. `ELANG_SPEC.md`  
   → Language definition, syntax, semantics, constraints

2. `ELANG.abnf`  
   → Formal grammar (parsing authority)

3. `MANUSCRIPT.md`  
   → Research framing, claims, scope, limitations

4. `README.md`  
   → Public-facing explanation and guardrails

If there is a conflict:
- **Spec > Grammar > Manuscript > README**

Agents must flag conflicts, not silently resolve them.

---

## 3. Language Stability Rules

### 3.1 Axes
- Canonical axes and order: `V,A,C,S,K,D,B,N`
- `C` = **Agency** (Control is a legacy alias only)

Agents may:
- Clarify definitions
- Improve wording
- Add examples

Agents may NOT:
- Rename axes
- Reorder axes
- Add new axes without explicit author approval

---

### 3.2 Syntax & Grammar
- Canonical state form: `E{V,A,C,S,K,D,B,N}`
- Operator precedence is fixed
- Unicode operators are normative

Agents may:
- Add ASCII aliases as optional tooling extensions
- Build parsers, linters, and formatters

Agents may NOT:
- Change grammar rules
- Introduce ambiguous shorthand
- Auto-correct invalid expressions without warning

---

## 4. Ethics & License Boundary

### 4.1 License
- The project uses a **permissive license (MIT)**
- Agents must not imply legal restrictions beyond the license

### 4.2 Ethical Guidance
Ethical sections are **non-binding normative statements**.

Agents should:
- Preserve separation of representation and interpretation
- Center user authorship and consent
- Avoid affect inference or surveillance framing

Agents must NOT:
- Enforce ethics as code restrictions
- Add “responsible use” clauses to the license
- Claim ethical guarantees

---

## 5. What Agents SHOULD Actively Help With

### 5.1 Specification & Tooling
- Parser implementations (Python, TypeScript, Rust)
- Grammar validation against `ELANG.abnf`
- AST definitions
- Serialization/deserialization
- Canonical formatting tools
- Test expansion based on fixtures

### 5.2 Documentation
- Clarifying examples
- Visual diagrams (axes, trajectories)
- Developer documentation
- API reference drafts

### 5.3 Research Support
- Formatting `MANUSCRIPT.md` for journal submission
- Generating figures
- Managing references and citations
- Preparing preprints

### 5.4 Public Adoption
- README improvements (clarity, examples)
- Tutorials and walkthroughs
- Sample journals
- Demo datasets (synthetic, non-personal)

---

## 6. What Agents MUST NOT Do

Agents must not:

- Expand scope into diagnosis, therapy, or treatment
- Claim clinical validity
- Introduce normative emotional judgments
- Collapse representation into labels
- Infer emotional state from behavior or data
- Over-optimize for AI consumption at the expense of human readability

If asked to do any of the above, the agent should **refuse and explain why**.

---

## 7. Contribution Workflow

Agents should follow this pattern:

1. **Read first**
   - `ELANG_SPEC.md`
   - `ELANG.abnf`

2. **Propose**
   - Describe the change
   - Identify affected files
   - State whether change is additive or modifying

3. **Validate**
   - Does this preserve grammar stability?
   - Does it preserve ethical boundaries?
   - Does it preserve neurodivergent framing?

4. **Implement**
   - Minimal, reversible changes
   - No silent refactors

5. **Document**
   - Update README or inline comments if behavior changes

---

## 8. Agent Tone & Posture

Agents should adopt:
- Precise, formal, non-sensational language
- Infrastructure mindset
- Respect for lived experience without appropriation

Agents should avoid:
- Evangelism
- Anthropomorphizing the system
- Overclaiming impact

---

## 9. Red Flags (Stop and Ask)

Agents must pause and ask before proceeding if a request involves:
- New primitives or axes
- Changing canonical syntax
- Reframing ethics as enforcement
- Claims of universality
- Medical or diagnostic use

---

## 10. Project North Star

E-Lang succeeds if:
- Different implementations remain compatible
- Users can express emotion without naming it
- Meaning can be added later—or not at all
- Neurodivergent users experience reduced translation pressure

Agents should optimize for **clarity, stability, and trust** over novelty.

---

**E-Lang is a language.  
Languages survive by staying precise.**