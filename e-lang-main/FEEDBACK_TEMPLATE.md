# E-Lang Feedback Template

Use this template when submitting feedback, questions, or bug reports about E-Lang.

**Before submitting:** Please review [`REVIEW_GUIDELINES.md`](REVIEW_GUIDELINES.md) to understand what feedback is welcome and what is out of scope.

---

## What Were You Trying to Do?

Describe your goal or use case:

```
[Describe what you were trying to accomplish with E-Lang]
```

---

## What Part of the Project Were You Using?

Check all that apply:
- [ ] Parser (`elang_parser/`)
- [ ] JSON Schemas (`elang_state.schema.json`, `elang_ast.schema.json`)
- [ ] Documentation (TUTORIAL.md, DEVELOPER_GUIDE.md, etc.)
- [ ] Reference tools (`tools/`)
- [ ] Specification (`ELANG_SPEC.md`)
- [ ] Grammar (`ELANG.abnf`)
- [ ] Other: _______________

---

## What Worked as Expected?

Describe what functioned correctly:

```
[What worked well? What met your expectations?]
```

---

## What Was Unclear or Confusing?

Describe any confusion or unclear aspects:

```
[What was confusing? What didn't work as you expected?]
```

---

## Feedback Category

Based on [`REVIEW_GUIDELINES.md`](REVIEW_GUIDELINES.md), this feedback seems to be:

- [ ] Documentation clarification needed
- [ ] Tooling bug
- [ ] Specification misunderstanding
- [ ] Usability issue
- [ ] Other: _______________

---

## Scope Acknowledgment

**Important:** E-Lang has explicit scope boundaries. Please acknowledge:

- [ ] I understand that E-Lang does **not** provide semantic interpretation (emotion labels, meaning extraction)
- [ ] I understand that E-Lang does **not** evaluate expressions (no computation of operator results)
- [ ] I understand that grammar changes (new axes, operators) are frozen and require major version bump
- [ ] I understand that E-Lang is **not** a diagnostic or therapeutic tool
- [ ] My feedback is about existing functionality, documentation, or tooling, not requesting new semantics or interpretation features

If you checked "No" to any of the above, please review [`REVIEW_GUIDELINES.md`](REVIEW_GUIDELINES.md) and [`AGENTS.md`](AGENTS.md) before submitting.

---

## Additional Context

Any other relevant information:

```
[Version used, environment, related issues, etc.]
```

---

## Example Submission

### What Were You Trying to Do?
I was trying to parse a complex nested expression with multiple operators.

### What Part of the Project Were You Using?
- [x] Parser (`elang_parser/`)
- [x] Documentation (DEVELOPER_GUIDE.md)

### What Worked as Expected?
The parser successfully parsed simple state vectors.

### What Was Unclear or Confusing?
I wasn't sure how operator precedence works when combining `mask()`, `⊗`, and `⊕` in the same expression. The documentation mentions precedence but doesn't show a complex example.

### Feedback Category
- [x] Documentation clarification needed

### Scope Acknowledgment
- [x] I understand that E-Lang does **not** provide semantic interpretation
- [x] I understand that E-Lang does **not** evaluate expressions
- [x] I understand that grammar changes are frozen
- [x] I understand that E-Lang is **not** a diagnostic tool
- [x] My feedback is about existing functionality

---

## How to Submit

1. **GitHub Issue:** Use this template when creating a new issue
2. **Discussion:** For questions or community conversation
3. **Email:** [If applicable]

**Response timeline:** We acknowledge all feedback, but cannot commit to specific timelines for addressing it.

---

**Thank you for your feedback. It helps us improve E-Lang while maintaining stability.**