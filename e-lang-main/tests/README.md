# E-Lang Tests (Placeholders)

These tests are placeholders intended to lock the v0 grammar and prevent drift across implementations.

## What to add next
- Parser unit tests that:
  - accept valid canonical vectors
  - reject wrong axis order
  - enforce operator precedence
  - parse trajectories and parentheses correctly
- Semantic validation tests that:
  - enforce axis range [-1, 1]
  - enforce mask range [0, 1]
  - validate ctx tag pattern

## Suggested structure
- `tests/fixtures/valid_states.txt`
- `tests/fixtures/invalid_states.txt`
- `tests/fixtures/valid_expressions.txt`
- `tests/fixtures/invalid_expressions.txt`
- `tests/test_parser.py` (or `test_parser.ts`)

## Reference Implementation

A Python reference parser is available at `elang_parser.py` in the repository root.

To run tests:
```bash
# Install pytest (if not already installed)
pip install pytest

# Run tests
pytest tests/test_parser.py -v
```

Or test the parser directly:
```bash
python3 elang_parser.py
```
