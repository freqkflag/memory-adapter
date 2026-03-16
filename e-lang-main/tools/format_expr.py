#!/usr/bin/env python3
"""
E-Lang Expression Formatter

Formats E-Lang expressions in canonical form (lossless, round-trippable).
Performs formatting only; no interpretation, evaluation, or normalization.

Usage:
    python3 tools/format_expr.py "E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}"
    echo "E{0,0,0,0,0,0,0,0}" | python3 tools/format_expr.py
"""

import sys
import re
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from elang_parser import parse_expression
from elang_parser.ast import State, Macro, Context, MaskCall, BinaryOp


def format_state(state):
    """Format state vector in canonical form."""
    values = [f"{v:+.3f}".rstrip('0').rstrip('.') if v != int(v) else f"{int(v):+d}" 
              for v in state.values]
    # Normalize +0 to 0 for readability
    values = [v.replace('+0', '0') if v in ['+0', '+0.0'] else v for v in values]
    return f"E{{{','.join(values)}}}"


def format_expr(expr):
    """Format expression in canonical form (lossless)."""
    if isinstance(expr, State):
        return format_state(expr)
    
    elif isinstance(expr, Macro):
        return expr.name
    
    elif isinstance(expr, Context):
        return f"ctx({expr.tag})"
    
    elif isinstance(expr, MaskCall):
        inner = format_expr(expr.expr)
        return f"mask({inner}, {expr.value})"
    
    elif isinstance(expr, BinaryOp):
        left = format_expr(expr.left)
        right = format_expr(expr.right)
        
        # Add spaces around operators for readability
        op = expr.op
        return f"{left} {op} {right}"
    
    else:
        return str(expr)


def main():
    if len(sys.argv) > 1:
        # Expression from command line
        text = " ".join(sys.argv[1:])
    else:
        # Expression from stdin
        text = sys.stdin.read().strip()
    
    if not text:
        print("Usage: python3 tools/format_expr.py <expression>", file=sys.stderr)
        print("   or: echo '<expression>' | python3 tools/format_expr.py", file=sys.stderr)
        sys.exit(1)
    
    try:
        # Parse to validate and normalize structure
        expr = parse_expression(text)
        # Format back to canonical form
        formatted = format_expr(expr)
        print(formatted)
        return 0
    except Exception as e:
        print(f"✗ Parse error: {e}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())