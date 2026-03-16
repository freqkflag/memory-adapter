# Release Checklist

Use this checklist before tagging a release.

## Tag Format

- Use semantic versioning: `v0.1.0`, `v0.2.0`, `v1.0.0`
- Tag format: `v<major>.<minor>.<patch>`

---

## Pre-Release Validation

### Documentation Links
- [ ] All README.md links point to existing files
- [ ] `ELANG_SPEC.md` path is correct in README
- [ ] `ELANG.abnf` path is correct in README
- [ ] All referenced files exist in repository root

### Grammar and Specification
- [ ] `ELANG.abnf` is present and valid ABNF
- [ ] `ELANG_SPEC.md` matches grammar in `ELANG.abnf`
- [ ] Axis order is locked: `V,A,C,S,K,D,B,N`
- [ ] `C` is defined as **Agency** (Control is legacy alias only)
- [ ] Canonical state form is `E{V,A,C,S,K,D,B,N}`

### Test Fixtures
- [ ] `tests/fixtures/valid_states.txt` exists and contains valid examples
- [ ] `tests/fixtures/invalid_states.txt` exists and contains invalid examples
- [ ] `tests/fixtures/valid_expressions.txt` exists and contains valid expressions
- [ ] `tests/fixtures/invalid_expressions.txt` exists and contains invalid expressions
- [ ] All fixtures parse correctly (or fail correctly) according to grammar

### License and Ethics
- [ ] `LICENSE` file is present (MIT)
- [ ] Ethics section in README is clearly labeled as **non-binding**
- [ ] No "responsible use" clauses added to LICENSE
- [ ] Ethical guidance is explicitly separated from legal license terms

### Repository Structure
- [ ] All canonical files are in repository root (not in subdirectories)
- [ ] `AGENTS.md` is present and up to date
- [ ] `CONTRIBUTING.md` is present
- [ ] `ROADMAP.md` is present (if applicable)

### Version Consistency
- [ ] README version matches intended release tag
- [ ] `ELANG_SPEC.md` version header matches release
- [ ] `ROADMAP.md` status reflects current release (if applicable)

---

## Release Steps

1. Complete all pre-release validation checks above
2. Update version references in README and spec files
3. Create annotated tag: `git tag -a v0.1.0 -m "Release v0.1.0: Specification locked"`
4. Push tag: `git push origin v0.1.0`
5. Create GitHub release from tag with release notes

---

## Post-Release

- [ ] Verify tag appears on GitHub
- [ ] Verify release notes are clear
- [ ] Update ROADMAP.md status if needed

---

**Remember:** E-Lang prioritizes stability and precision. Only tag releases when the specification is frozen and all validation checks pass.