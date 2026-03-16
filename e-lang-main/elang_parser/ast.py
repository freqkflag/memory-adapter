"""
E-Lang AST Node Definitions

AST nodes represent the structure of E-Lang expressions without interpretation.
"""

from dataclasses import dataclass
from typing import List, Union, Optional


@dataclass
class State:
    """Represents an E-Lang state vector: E{V,A,C,S,K,D,B,N}"""
    values: List[float]  # ordered V,A,C,S,K,D,B,N


@dataclass
class Macro:
    """Represents a macro identifier (e.g., ALARM, BOND)."""
    name: str


@dataclass
class Context:
    """Represents a context annotation: ctx(tag)"""
    tag: str


@dataclass
class MaskCall:
    """Represents a masking annotation: mask(expr, m)"""
    expr: "Expr"
    value: float  # mask value in [0, 1]


@dataclass
class BinaryOp:
    """Represents a binary operator expression."""
    left: "Expr"
    op: str  # '→', '⊕', '⟂', '⊗'
    right: "Expr"


# Expression type: any valid E-Lang expression node
Expr = Union[State, Macro, Context, MaskCall, BinaryOp]