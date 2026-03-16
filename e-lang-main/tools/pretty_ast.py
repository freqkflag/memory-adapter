#!/usr/bin/env python3
"""
E-Lang AST Pretty-Printer

Prints a structural representation of an E-Lang AST.
Performs formatting only; no interpretation or evaluation.

Usage:
    python3 tools/pretty_ast.py "E{0,0,0,0,0,0,0,0} → E{1,1,1,1,1,1,1,1}"
    echo "E{0,0,0,0,0,0,0,0}" | python3 tools/pretty_ast.py
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from elang_parser import parse_expression
from elang_parser.ast import State, Macro, Context, MaskCall, BinaryOp


def format_ast(expr, indent=0):
    """Format AST as a structural tree (no interpretation)."""
    prefix = "  " * indent
    
    if isinstance(expr, State):
        values_str = ", ".join(f"{v:+.1f}" for v in expr.values)
        return f"{prefix}State(values=[{values_str}])"
    
    elif isinstance(expr, Macro):
        return f"{prefix}Macro(name='{expr.name}')"
    
    elif isinstance(expr, Context):
        return f"{prefix}Context(tag='{expr.tag}')"
    
    elif isinstance(expr, MaskCall):
        result = f"{prefix}MaskCall(\n"
        result += f"{prefix}  expr=\n{format_ast(expr.expr, indent + 2)},\n"
        result += f"{prefix}  value={expr.value}\n"
        result += f"{prefix})"
        return result
    
    elif isinstance(expr, BinaryOp):
        result = f"{prefix}BinaryOp(\n"
        result += f"{prefix}  op='{expr.op}',\n"
        result += f"{prefix}  left=\n{format_ast(expr.left, indent + 2)},\n"
        result += f"{prefix}  right=\n{format_ast(expr.right, indent + 2)}\n"
        result += f"{prefix})"
        return result
    
    else:
        return f"{prefix}Unknown({type(expr).__name__})"


def main():
    if len(sys.argv) > 1:
        # Expression from command line
        text = " ".join(sys.argv[1:])
    else:
        # Expression from stdin
        text = sys.stdin.read().strip()
    
    if not text:
        print("Usage: python3 tools/pretty_ast.py <expression>", file=sys.stderr)
        print("   or: echo '<expression>' | python3 tools/pretty_ast.py", file=sys.stderr)
        sys.exit(1)
    
    try:
        expr = parse_expression(text)
        print(format_ast(expr))
        return 0
    except Exception as e:
        print(f"✗ Parse error: {e}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())