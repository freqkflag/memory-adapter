# v0.2.0 Release Checklist

**Release:** v0.2.0 — Reference Tooling Release  
**Date:** January 2026

---

## Pre-Release Validation

### Documentation Links
- [x] All README.md links point to existing files
- [x] `ELANG_SPEC.md` path is correct in README
- [x] `ELANG.abnf` path is correct in README
- [x] `PARSER_API.md` exists and is referenced
- [x] JSON Schema files exist and are referenced
- [x] All referenced files exist in repository root

### Grammar and Specification
- [x] `ELANG.abnf` is present and valid ABNF
- [x] `ELANG_SPEC.md` matches grammar in `ELANG.abnf`
- [x] Axis order is locked: `V,A,C,S,K,D,B,N`
- [x] `C` is defined as **Agency** (Control is legacy alias only)
- [x] Canonical state form is `E{V,A,C,S,K,D,B,N}`
- [x] Grammar remains frozen (no changes from v0.1)

### Parser Implementation
- [x] `elang_parser/parser.py` implements full grammar
- [x] `elang_parser/ast.py` defines all AST node types
- [x] `parse_state()` function preserved (backward compatible)
- [x] `parse_expression()` function implements full expressions
- [x] Operator precedence correctly enforced
- [x] All operators supported: `→`, `⊕`, `⟂`, `⊗`
- [x] `mask()` and `ctx()` functions supported

### Test Suite
- [x] `tests/test_expression_parser.py` exists (34 tests)
- [x] `tests/test_reference_parser.py` exists (expanded)
- [x] `tests/fixtures/valid_states.txt` exists
- [x] `tests/fixtures/invalid_states.txt` exists
- [x] `tests/fixtures/valid_expressions.txt` exists
- [x] `tests/fixtures/invalid_expressions.txt` exists
- [x] All fixtures parse correctly (or fail correctly)

### JSON Schemas
- [x] `elang_state.schema.json` exists and is valid JSON
- [x] `elang_ast.schema.json` exists and is valid JSON
- [x] State schema matches `ELANG_SPEC.md` section 4
- [x] AST schema matches `PARSER_API.md` definitions
- [x] Extension points documented (`x_*` namespace)
- [x] Example JSON documents provided

### Documentation
- [x] `PARSER_API.md` documents complete interface
- [x] `schemas/README.md` explains schema usage
- [x] `RELEASE_NOTES_v0.2.md` created
- [x] README version section updated to v0.2
- [x] ROADMAP.md status updated for v0.2

### License and Ethics
- [x] `LICENSE` file is present (MIT)
- [x] Ethics section in README is clearly labeled as **non-binding**
- [x] No "responsible use" clauses added to LICENSE
- [x] Ethical guidance is explicitly separated from legal license terms

### Repository Structure
- [x] All canonical files are in repository root
- [x] `AGENTS.md` is present and up to date
- [x] `CONTRIBUTING.md` is present
- [x] `ROADMAP.md` is present and updated

### Version Consistency
- [x] README version matches intended release tag (v0.2)
- [x] `ELANG_SPEC.md` version header is "v0" (frozen)
- [x] `ROADMAP.md` status reflects v0.2 completion
- [x] `RELEASE_NOTES_v0.2.md` version is v0.2.0

### CI and Testing
- [x] CI workflow is active and passing
- [x] All tests pass locally
- [x] No breaking changes to existing functionality
- [x] Backward compatibility maintained

---

## Release Steps

1. **Final verification:**
   ```bash
   # Verify all tests pass
   pytest tests/ -v
   
   # Verify schemas are valid JSON
   python3 -c "import json; json.load(open('elang_state.schema.json')); json.load(open('elang_ast.schema.json'))"
   
   # Verify parser imports
   python3 -c "from elang_parser import parse_state, parse_expression; print('✓ Parser imports work')"
   ```

2. **Commit all changes:**
   ```bash
   git add RELEASE_NOTES_v0.2.md README.md ROADMAP.md RELEASE_v0.2_CHECKLIST.md
   git commit -m "Prepare v0.2.0 release: parser, schemas, and documentation"
   ```

3. **Create annotated tag:**
   ```bash
   git tag -a v0.2.0 -m "Release v0.2.0: Grammar-complete parser, API docs, JSON Schema interoperability"
   ```

4. **Push tag:**
   ```bash
   git push origin v0.2.0
   ```

5. **Create GitHub Release:**
   - Go to: https://github.com/freqkflag/e-lang/releases/new
   - Tag: `v0.2.0`
   - Title: "E-Lang v0.2.0 — Reference Tooling Release"
   - Description: Copy contents of `RELEASE_NOTES_v0.2.md`
   - Publish release

---

## Post-Release

- [ ] Verify tag appears on GitHub
- [ ] Verify release notes are clear and complete
- [ ] Update ROADMAP.md status if needed (already done)
- [ ] Announce release (if applicable)

---

## Release Summary

**v0.2.0 adds:**
- Grammar-complete expression parser
- Parser API documentation
- JSON Schema interoperability
- Expanded test suite
- CI hardening

**v0.2.0 preserves:**
- v0.1 grammar (frozen)
- v0.1 specification (frozen)
- Backward compatibility (`parse_state()` unchanged)

**v0.2.0 does NOT add:**
- Semantic interpretation
- Expression evaluation
- New syntax or operators
- Grammar changes

---

**E-Lang v0.2.0 is ready for release.**