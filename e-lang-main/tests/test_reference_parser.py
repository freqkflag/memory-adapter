"""
E-Lang Reference Parser Tests

Tests the minimal reference parser implementation for correctness,
boundary conditions, and error handling.
"""

import pytest
from elang_parser.parser import parse_state
from elang_parser.validate import validate_state


# ============================================================================
# Valid State Tests
# ============================================================================

def test_valid_state():
    """Test parsing a valid state with mixed values."""
    s = parse_state("E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}")
    assert len(s.values) == 8
    assert s.values == [-0.4, 0.7, -0.2, -0.6, -0.1, -0.3, 0.8, 0.2]


# ============================================================================
# Boundary Value Tests
# ============================================================================

def test_boundary_minus_one():
    """Test all axes at -1.0 (minimum boundary)."""
    s = parse_state("E{-1,-1,-1,-1,-1,-1,-1,-1}")
    assert len(s.values) == 8
    assert all(v == -1.0 for v in s.values)


def test_boundary_zero():
    """Test all axes at 0.0 (neutral)."""
    s = parse_state("E{0,0,0,0,0,0,0,0}")
    assert len(s.values) == 8
    assert all(v == 0.0 for v in s.values)


def test_boundary_plus_one():
    """Test all axes at +1.0 (maximum boundary)."""
    s = parse_state("E{1,1,1,1,1,1,1,1}")
    assert len(s.values) == 8
    assert all(v == 1.0 for v in s.values)


def test_boundary_mixed():
    """Test mixed boundary values in one state."""
    s = parse_state("E{-1,0,1,-1,0,1,-1,0}")
    assert len(s.values) == 8
    assert s.values == [-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, -1.0, 0.0]


def test_boundary_with_signs():
    """Test boundary values with explicit signs."""
    s = parse_state("E{-1.0,+0.0,+1.0,-1.0,+0.0,+1.0,-1.0,+0.0}")
    assert len(s.values) == 8
    assert s.values == [-1.0, 0.0, 1.0, -1.0, 0.0, 1.0, -1.0, 0.0]


# ============================================================================
# Whitespace Tolerance Tests
# ============================================================================

def test_whitespace_inside_braces():
    """Test spaces inside braces are tolerated."""
    s1 = parse_state("E{ 0, 0, 0, 0, 0, 0, 0, 0 }")
    s2 = parse_state("E{0,0,0,0,0,0,0,0}")
    assert s1.values == s2.values


def test_whitespace_around_commas():
    """Test spaces around commas are tolerated."""
    s1 = parse_state("E{0 , 0 , 0 , 0 , 0 , 0 , 0 , 0}")
    s2 = parse_state("E{0,0,0,0,0,0,0,0}")
    assert s1.values == s2.values


def test_leading_trailing_whitespace():
    """Test leading and trailing whitespace is stripped."""
    s1 = parse_state("  E{0,0,0,0,0,0,0,0}  ")
    s2 = parse_state("E{0,0,0,0,0,0,0,0}")
    assert s1.values == s2.values


def test_tabs_instead_of_spaces():
    """Test tabs are treated as whitespace."""
    s = parse_state("E{\t0,\t0,\t0,\t0,\t0,\t0,\t0,\t0\t}")
    assert len(s.values) == 8
    assert all(v == 0.0 for v in s.values)


# ============================================================================
# Malformed Syntax Tests
# ============================================================================

def test_invalid_state_length_too_few():
    """Test rejection of states with too few values."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{0,0,0,0,0,0,0}")
    assert "exactly 8" in str(exc_info.value) or "Invalid" in str(exc_info.value)


def test_invalid_state_length_too_many():
    """Test rejection of states with too many values."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{0,0,0,0,0,0,0,0,0}")
    assert "exactly 8" in str(exc_info.value) or "Invalid" in str(exc_info.value)


def test_invalid_missing_braces():
    """Test rejection of states missing opening brace."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E0,0,0,0,0,0,0,0}")
    assert "Invalid" in str(exc_info.value)
    assert len(str(exc_info.value)) > 0  # Non-empty error message


def test_invalid_missing_closing_brace():
    """Test rejection of states missing closing brace."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{0,0,0,0,0,0,0,0")
    assert "Invalid" in str(exc_info.value)
    assert len(str(exc_info.value)) > 0


def test_invalid_missing_commas():
    """Test rejection of states missing commas."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{0 0 0 0 0 0 0 0}")
    assert "Invalid" in str(exc_info.value)
    assert len(str(exc_info.value)) > 0


def test_invalid_trailing_comma():
    """Test rejection of states with trailing comma."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{0,0,0,0,0,0,0,0,}")
    assert "Invalid" in str(exc_info.value) or "exactly 8" in str(exc_info.value)
    assert len(str(exc_info.value)) > 0


def test_invalid_non_numeric():
    """Test rejection of states with non-numeric values."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{a,0,0,0,0,0,0,0}")
    assert "Invalid" in str(exc_info.value)
    assert len(str(exc_info.value)) > 0


def test_invalid_empty_state():
    """Test rejection of empty state."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{}")
    assert "Invalid" in str(exc_info.value) or "exactly 8" in str(exc_info.value)
    assert len(str(exc_info.value)) > 0


def test_invalid_missing_e_prefix():
    """Test rejection of states missing 'E' prefix."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("{0,0,0,0,0,0,0,0}")
    assert "Invalid" in str(exc_info.value)
    assert len(str(exc_info.value)) > 0


# ============================================================================
# Range Validation Tests
# ============================================================================

def test_out_of_range_above_max():
    """Test rejection of values above 1.0."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{0,0,0,0,0,0,0,2}")
    assert "out of range" in str(exc_info.value)
    assert "2" in str(exc_info.value)  # Error message includes the value


def test_out_of_range_below_min():
    """Test rejection of values below -1.0."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{0,0,0,0,0,0,0,-2}")
    assert "out of range" in str(exc_info.value)
    assert "-2" in str(exc_info.value)  # Error message includes the value


def test_out_of_range_just_above():
    """Test rejection of values just above 1.0."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{0,0,0,0,0,0,0,1.0001}")
    assert "out of range" in str(exc_info.value)


def test_out_of_range_just_below():
    """Test rejection of values just below -1.0."""
    with pytest.raises(ValueError) as exc_info:
        parse_state("E{0,0,0,0,0,0,0,-1.0001}")
    assert "out of range" in str(exc_info.value)


# ============================================================================
# Value Format Tests
# ============================================================================

def test_decimal_values():
    """Test parsing decimal values."""
    s = parse_state("E{0.5,-0.3,0.7,0.0,-0.9,0.1,0.2,-0.4}")
    assert len(s.values) == 8
    assert s.values[0] == 0.5
    assert s.values[1] == -0.3


def test_integer_values():
    """Test parsing integer values (implicit .0)."""
    s = parse_state("E{1,-1,0,1,-1,0,1,-1}")
    assert len(s.values) == 8
    assert all(isinstance(v, float) for v in s.values)


def test_leading_plus_sign():
    """Test parsing values with explicit plus sign."""
    s = parse_state("E{+0.5,+1.0,+0.0,-0.5,-1.0,-0.0,+0.3,-0.7}")
    assert len(s.values) == 8
    assert s.values[0] == 0.5
    assert s.values[1] == 1.0


def test_no_leading_zero():
    """Test parsing values without leading zero (e.g., .5)."""
    s = parse_state("E{.5,-.3,.7,0,-.9,.1,.2,-.4}")
    assert len(s.values) == 8
    assert s.values[0] == 0.5
    assert s.values[1] == -0.3


# ============================================================================
# Failure Quality Tests
# ============================================================================

def test_error_messages_are_non_empty():
    """Test that all error messages are non-empty and actionable."""
    test_cases = [
        "E{0,0,0,0,0,0,0}",  # Too few
        "E{0,0,0,0,0,0,0,0,0}",  # Too many
        "E{0,0,0,0,0,0,0,2}",  # Out of range
        "E{a,0,0,0,0,0,0,0}",  # Non-numeric
        "E{0,0,0,0,0,0,0,0",  # Missing brace
    ]
    
    for test_case in test_cases:
        with pytest.raises(ValueError) as exc_info:
            parse_state(test_case)
        error_msg = str(exc_info.value)
        assert len(error_msg) > 0, f"Empty error message for: {test_case}"
        assert error_msg.strip() == error_msg, f"Error message has leading/trailing whitespace: {error_msg}"


def test_error_type_is_value_error():
    """Test that all errors raise ValueError, not generic Exception."""
    test_cases = [
        "E{0,0,0,0,0,0,0}",
        "E{0,0,0,0,0,0,0,2}",
        "E{a,0,0,0,0,0,0,0}",
    ]
    
    for test_case in test_cases:
        with pytest.raises(ValueError):
            parse_state(test_case)


# ============================================================================
# Edge Cases
# ============================================================================

def test_zero_with_different_formats():
    """Test that zero can be represented in different formats."""
    s1 = parse_state("E{0,0,0,0,0,0,0,0}")
    s2 = parse_state("E{0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0}")
    s3 = parse_state("E{+0,-0,+0.0,-0.0,0,0.0,+0,-0.0}")
    assert s1.values == s2.values
    assert all(v == 0.0 for v in s3.values)


def test_very_small_values():
    """Test parsing very small decimal values."""
    s = parse_state("E{0.0001,-0.0001,0.001,-0.001,0.01,-0.01,0.1,-0.1}")
    assert len(s.values) == 8
    assert all(-1.0 <= v <= 1.0 for v in s.values)


def test_mixed_precision():
    """Test parsing values with mixed precision."""
    s = parse_state("E{1,-1,0.5,-0.5,0.25,-0.25,0.125,-0.125}")
    assert len(s.values) == 8
    assert s.values == [1.0, -1.0, 0.5, -0.5, 0.25, -0.25, 0.125, -0.125]