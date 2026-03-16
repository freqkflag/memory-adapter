"""
E-Lang v0.2 Reference Parser

A minimal, correct reference implementation for parsing E-Lang expressions.
"""

from elang_parser.parser import parse_state, parse_expression
from elang_parser.ast import State, Macro, Context, MaskCall, BinaryOp, Expr
from elang_parser.validate import validate_state, validate_mask

__all__ = [
    'parse_state',
    'parse_expression',
    'State',
    'Macro',
    'Context',
    'MaskCall',
    'BinaryOp',
    'Expr',
    'validate_state',
    'validate_mask',
]