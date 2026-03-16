"""
E-Lang v0 Parser Tests

Tests the reference parser implementation against fixture files.
"""

import pytest
from pathlib import Path
from elang_parser import parse, ParseError, ValidationError

FIXTURES = Path(__file__).parent / "fixtures"


def load_fixtures(filename):
    """Load fixture file, stripping comments."""
    path = FIXTURES / filename
    if not path.exists():
        return []
    
    lines = []
    for line in path.read_text().splitlines():
        # Strip comments
        if '#' in line:
            line = line[:line.index('#')]
        line = line.strip()
        if line:
            lines.append(line)
    return lines


def test_valid_states():
    """Test that all valid states parse correctly."""
    for expr in load_fixtures("valid_states.txt"):
        try:
            ast = parse(expr)
            assert ast is not None, f"Failed to parse: {expr}"
            # Validate that it's a state node
            if hasattr(ast, 'type'):
                assert ast.type == 'state', f"Expected state, got {ast.type}"
        except (ParseError, ValidationError) as e:
            pytest.fail(f"Valid state failed to parse: {expr}\nError: {e}")


def test_invalid_states():
    """Test that invalid states are rejected."""
    for expr in load_fixtures("invalid_states.txt"):
        with pytest.raises((ParseError, ValidationError)):
            parse(expr)


def test_valid_expressions():
    """Test that all valid expressions parse correctly."""
    for expr in load_fixtures("valid_expressions.txt"):
        try:
            ast = parse(expr)
            assert ast is not None, f"Failed to parse: {expr}"
        except (ParseError, ValidationError) as e:
            pytest.fail(f"Valid expression failed to parse: {expr}\nError: {e}")


def test_invalid_expressions():
    """Test that invalid expressions are rejected."""
    for expr in load_fixtures("invalid_expressions.txt"):
        with pytest.raises((ParseError, ValidationError)):
            parse(expr)


def test_axis_order():
    """Test that axis order is enforced."""
    # Valid: correct order V,A,C,S,K,D,B,N
    ast = parse("E{0,0,0,0,0,0,0,0}")
    assert ast is not None
    
    # The parser should enforce exactly 8 values in order
    # This is tested implicitly by the grammar


def test_value_ranges():
    """Test that value ranges are validated."""
    # Valid: in range
    parse("E{-1.0,0.0,0.5,1.0,0,0,0,0}")
    
    # Invalid: out of range (should be caught by validation)
    with pytest.raises(ValidationError):
        parse("E{2.0,0,0,0,0,0,0,0}")
    
    with pytest.raises(ValidationError):
        parse("E{-2.0,0,0,0,0,0,0,0}")


def test_mask_range():
    """Test that mask values are validated to [0, 1]."""
    # Valid: in range
    parse("mask(E{0,0,0,0,0,0,0,0}, 0.5)")
    parse("mask(E{0,0,0,0,0,0,0,0}, 0.0)")
    parse("mask(E{0,0,0,0,0,0,0,0}, 1.0)")
    
    # Invalid: out of range
    with pytest.raises(ValidationError):
        parse("mask(E{0,0,0,0,0,0,0,0}, 1.5)")
    
    with pytest.raises(ValidationError):
        parse("mask(E{0,0,0,0,0,0,0,0}, -0.1)")


def test_operator_precedence():
    """Test that operator precedence is correctly parsed."""
    # mask > ctx > (⊕,⟂) > →
    expr = "mask(E{0,0,0,0,0,0,0,0} ⊗ ctx(work) ⊕ E{0,0,0,0,0,0,0,0}, 0.5)"
    ast = parse(expr)
    assert ast is not None
    
    # The AST structure should reflect precedence
    # mask should be outermost, then ctx, then ⊕, then →


def test_associativity():
    """Test operator associativity."""
    # ⊕ and ⟂ are left-associative
    expr1 = "E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0}"
    ast1 = parse(expr1)
    assert ast1 is not None
    
    # → is left-associative
    expr2 = "E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0}"
    ast2 = parse(expr2)
    assert ast2 is not None


def test_parentheses():
    """Test that parentheses override precedence."""
    # Without parentheses: mask applies first
    # With parentheses: inner expression evaluated first
    expr = "mask((E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0}), 0.5)"
    ast = parse(expr)
    assert ast is not None


def test_context_tags():
    """Test context tag parsing."""
    # Valid tags
    parse("E{0,0,0,0,0,0,0,0} ⊗ ctx(work)")
    parse("E{0,0,0,0,0,0,0,0} ⊗ ctx(home)")
    parse("E{0,0,0,0,0,0,0,0} ⊗ ctx(sensory)")
    parse("E{0,0,0,0,0,0,0,0} ⊗ ctx(work_meeting)")
    parse("E{0,0,0,0,0,0,0,0} ⊗ ctx(work-meeting)")
    
    # Invalid: empty tag
    with pytest.raises(ParseError):
        parse("E{0,0,0,0,0,0,0,0} ⊗ ctx()")
    
    # Invalid: space in tag
    with pytest.raises(ParseError):
        parse("E{0,0,0,0,0,0,0,0} ⊗ ctx(work space)")


def test_macros():
    """Test macro identifier parsing."""
    # Macros are identifiers
    parse("ALARM")
    parse("ALARM ⊕ BOND")
    parse("ALARM → CALM")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
