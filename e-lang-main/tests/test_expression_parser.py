"""
E-Lang Full Expression Parser Tests

Tests the full expression parser for operators, precedence, and complex expressions.
"""

import pytest
from elang_parser.parser import parse_expression, parse_state
from elang_parser.ast import State, Macro, Context, MaskCall, BinaryOp


# ============================================================================
# Backward Compatibility: State-Only Parsing
# ============================================================================

def test_parse_state_still_works():
    """Ensure existing parse_state() function still works."""
    s = parse_state("E{0,0,0,0,0,0,0,0}")
    assert isinstance(s, State)
    assert len(s.values) == 8


# ============================================================================
# Basic Expression Tests
# ============================================================================

def test_simple_state_expression():
    """Test parsing a simple state as expression."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr, State)
    assert len(expr.values) == 8


def test_simple_macro():
    """Test parsing a macro identifier."""
    expr = parse_expression("ALARM")
    assert isinstance(expr, Macro)
    assert expr.name == "ALARM"


# ============================================================================
# Operator Tests
# ============================================================================

def test_transition_operator():
    """Test transition operator (→)."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '→'
    assert isinstance(expr.left, State)
    assert isinstance(expr.right, State)


def test_blend_operator():
    """Test blend operator (⊕)."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊕ E{1,1,1,1,1,1,1,1}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '⊕'
    assert isinstance(expr.left, State)
    assert isinstance(expr.right, State)


def test_conflict_operator():
    """Test conflict operator (⟂)."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⟂ E{1,1,1,1,1,1,1,1}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '⟂'
    assert isinstance(expr.left, State)
    assert isinstance(expr.right, State)


def test_context_modulation():
    """Test context modulation operator (⊗)."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊗ ctx(work)")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '⊗'
    assert isinstance(expr.left, State)
    assert isinstance(expr.right, Context)
    assert expr.right.tag == "work"


def test_mask_call():
    """Test mask() function call."""
    expr = parse_expression("mask(E{0,0,0,0,0,0,0,0}, 0.7)")
    assert isinstance(expr, MaskCall)
    assert isinstance(expr.expr, State)
    assert expr.value == 0.7


# ============================================================================
# Operator Precedence Tests
# ============================================================================

def test_precedence_mask_highest():
    """Test that mask() has highest precedence."""
    # mask should apply to inner expression, not outer operator
    expr = parse_expression("mask(E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0}, 0.5)")
    assert isinstance(expr, MaskCall)
    assert isinstance(expr.expr, BinaryOp)
    assert expr.expr.op == '⊕'  # ⊕ is inside mask


def test_precedence_context_before_blend():
    """Test that ⊗ has higher precedence than ⊕."""
    # ⊗ should bind tighter than ⊕
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊗ ctx(work) ⊕ E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '⊕'  # ⊕ is outer
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '⊗'  # ⊗ is inner


def test_precedence_blend_before_transition():
    """Test that ⊕ has higher precedence than →."""
    # ⊕ should bind tighter than →
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '→'  # → is outer
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '⊕'  # ⊕ is inner


def test_precedence_conflict_before_transition():
    """Test that ⟂ has higher precedence than →."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⟂ E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '→'  # → is outer
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '⟂'  # ⟂ is inner


# ============================================================================
# Parentheses Tests
# ============================================================================

def test_parentheses_override_precedence():
    """Test that parentheses override operator precedence."""
    # Without parens: ⊕ binds tighter
    # With parens: → should bind first
    expr = parse_expression("(E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0}) ⊕ E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '⊕'  # ⊕ is outer
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '→'  # → is inside parens


def test_nested_parentheses():
    """Test nested parentheses."""
    expr = parse_expression("((E{0,0,0,0,0,0,0,0}))")
    assert isinstance(expr, State)
    assert len(expr.values) == 8


def test_parentheses_with_operators():
    """Test parentheses with multiple operators."""
    expr = parse_expression("(E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0}) → E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '→'
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '⊕'


# ============================================================================
# Associativity Tests
# ============================================================================

def test_blend_left_associative():
    """Test that ⊕ is left-associative."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0} ⊕ E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '⊕'
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '⊕'  # Left-associative: ((A ⊕ B) ⊕ C)


def test_conflict_left_associative():
    """Test that ⟂ is left-associative."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⟂ E{0,0,0,0,0,0,0,0} ⟂ E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '⟂'
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '⟂'  # Left-associative


def test_transition_left_associative():
    """Test that → is left-associative."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '→'
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '→'  # Left-associative: ((A → B) → C)


# ============================================================================
# Complex Expression Tests
# ============================================================================

def test_complex_nested_expression():
    """Test a complex nested expression from fixtures."""
    expr = parse_expression("mask((E{0,0,0,0,0,0,0,0} ⊗ ctx(work)) ⊕ E{0,0,0,0,0,0,0,0}, 0.3)")
    assert isinstance(expr, MaskCall)
    assert expr.value == 0.3
    assert isinstance(expr.expr, BinaryOp)
    assert expr.expr.op == '⊕'
    # Left side should be context modulation
    assert isinstance(expr.expr.left, BinaryOp)
    assert expr.expr.left.op == '⊗'


def test_macro_with_operators():
    """Test macros used with operators."""
    expr = parse_expression("ALARM ⊕ BOND → CALM")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '→'
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '⊕'
    assert isinstance(expr.left.left, Macro)
    assert expr.left.left.name == "ALARM"
    assert isinstance(expr.left.right, Macro)
    assert expr.left.right.name == "BOND"
    assert isinstance(expr.right, Macro)
    assert expr.right.name == "CALM"


def test_multiple_context_modulations():
    """Test multiple context modulations (left-associative)."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊗ ctx(work) ⊗ ctx(meeting)")
    assert isinstance(expr, BinaryOp)
    assert expr.op == '⊗'
    assert isinstance(expr.right, Context)
    assert expr.right.tag == "meeting"
    assert isinstance(expr.left, BinaryOp)
    assert expr.left.op == '⊗'


# ============================================================================
# Context Tag Tests
# ============================================================================

def test_context_tag_with_underscore():
    """Test context tag with underscore."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊗ ctx(work_meeting)")
    assert isinstance(expr, BinaryOp)
    assert isinstance(expr.right, Context)
    assert expr.right.tag == "work_meeting"


def test_context_tag_with_dash():
    """Test context tag with dash."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊗ ctx(work-meeting)")
    assert isinstance(expr, BinaryOp)
    assert isinstance(expr.right, Context)
    assert expr.right.tag == "work-meeting"


def test_context_tag_with_numbers():
    """Test context tag with numbers."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊗ ctx(room123)")
    assert isinstance(expr, BinaryOp)
    assert isinstance(expr.right, Context)
    assert expr.right.tag == "room123"


# ============================================================================
# Mask Value Tests
# ============================================================================

def test_mask_value_boundary_zero():
    """Test mask value at 0.0."""
    expr = parse_expression("mask(E{0,0,0,0,0,0,0,0}, 0.0)")
    assert isinstance(expr, MaskCall)
    assert expr.value == 0.0


def test_mask_value_boundary_one():
    """Test mask value at 1.0."""
    expr = parse_expression("mask(E{0,0,0,0,0,0,0,0}, 1.0)")
    assert isinstance(expr, MaskCall)
    assert expr.value == 1.0


def test_mask_value_out_of_range():
    """Test that mask values out of range are rejected."""
    with pytest.raises(ValueError) as exc_info:
        parse_expression("mask(E{0,0,0,0,0,0,0,0}, 1.5)")
    assert "out of range" in str(exc_info.value)


# ============================================================================
# Whitespace Tolerance Tests
# ============================================================================

def test_whitespace_around_operators():
    """Test whitespace around operators is tolerated."""
    expr1 = parse_expression("E{0,0,0,0,0,0,0,0}→E{0,0,0,0,0,0,0,0}")
    expr2 = parse_expression("E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0}")
    assert isinstance(expr1, BinaryOp)
    assert isinstance(expr2, BinaryOp)
    assert expr1.op == expr2.op == '→'


def test_whitespace_in_mask_call():
    """Test whitespace in mask() call is tolerated."""
    expr = parse_expression("mask( E{0,0,0,0,0,0,0,0} , 0.5 )")
    assert isinstance(expr, MaskCall)
    assert expr.value == 0.5


def test_whitespace_in_context():
    """Test whitespace in ctx() call is tolerated."""
    expr = parse_expression("E{0,0,0,0,0,0,0,0} ⊗ ctx( work )")
    assert isinstance(expr, BinaryOp)
    assert isinstance(expr.right, Context)
    assert expr.right.tag == "work"


# ============================================================================
# Error Handling Tests
# ============================================================================

def test_missing_closing_paren():
    """Test error on missing closing parenthesis."""
    with pytest.raises(ValueError):
        parse_expression("(E{0,0,0,0,0,0,0,0}")


def test_missing_comma_in_mask():
    """Test error on missing comma in mask()."""
    with pytest.raises(ValueError):
        parse_expression("mask(E{0,0,0,0,0,0,0,0} 0.5)")


def test_empty_context_tag():
    """Test error on empty context tag."""
    with pytest.raises(ValueError):
        parse_expression("E{0,0,0,0,0,0,0,0} ⊗ ctx()")


def test_unexpected_characters():
    """Test error on unexpected characters after valid expression."""
    with pytest.raises(ValueError) as exc_info:
        parse_expression("E{0,0,0,0,0,0,0,0} extra")
    assert "Unexpected characters" in str(exc_info.value)