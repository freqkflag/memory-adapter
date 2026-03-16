"""
E-Lang v0 Reference Parser

A minimal reference implementation that parses E-Lang expressions according to
ELANG.abnf and validates according to ELANG_SPEC.md.
"""

import re
from typing import Optional, List, Union
from dataclasses import dataclass


class ParseError(Exception):
    """Raised when parsing fails."""
    pass


class ValidationError(Exception):
    """Raised when validation fails (e.g., out of range values)."""
    pass


@dataclass
class State:
    """Represents an E-Lang state vector."""
    type: str = "state"
    values: List[float] = None
    
    def __post_init__(self):
        if self.values is None:
            self.values = []
        # Validate axis count
        if len(self.values) != 8:
            raise ValidationError(f"State must have exactly 8 axes, got {len(self.values)}")
        # Validate ranges
        for i, val in enumerate(self.values):
            if val < -1.0 or val > 1.0:
                raise ValidationError(f"Axis {i} value {val} out of range [-1.0, 1.0]")


@dataclass
class Macro:
    """Represents a macro identifier."""
    type: str = "macro"
    name: str = ""


@dataclass
class MaskCall:
    """Represents a mask() call."""
    type: str = "mask"
    expr: 'ASTNode' = None
    mask_value: float = 0.0
    
    def __post_init__(self):
        # Validate mask range
        if self.mask_value < 0.0 or self.mask_value > 1.0:
            raise ValidationError(f"Mask value {self.mask_value} out of range [0.0, 1.0]")


@dataclass
class Context:
    """Represents a context application."""
    type: str = "context"
    expr: 'ASTNode' = None
    tag: str = ""


@dataclass
class Blend:
    """Represents a blend (⊕) operation."""
    type: str = "blend"
    left: 'ASTNode' = None
    right: 'ASTNode' = None


@dataclass
class Conflict:
    """Represents a conflict (⟂) operation."""
    type: str = "conflict"
    left: 'ASTNode' = None
    right: 'ASTNode' = None


@dataclass
class Transition:
    """Represents a transition (→) operation."""
    type: str = "transition"
    left: 'ASTNode' = None
    right: 'ASTNode' = None


ASTNode = Union[State, Macro, MaskCall, Context, Blend, Conflict, Transition]


class Parser:
    """E-Lang parser following the ABNF grammar."""
    
    def __init__(self, text: str):
        self.text = text
        self.pos = 0
        self.length = len(text)
    
    def peek(self, n: int = 1) -> str:
        """Peek at next n characters without advancing."""
        if self.pos + n > self.length:
            return ""
        return self.text[self.pos:self.pos + n]
    
    def consume(self, n: int = 1) -> str:
        """Consume and return next n characters."""
        if self.pos + n > self.length:
            return ""
        result = self.text[self.pos:self.pos + n]
        self.pos += n
        return result
    
    def skip_whitespace(self):
        """Skip whitespace (SP, HTAB)."""
        while self.pos < self.length:
            char = self.text[self.pos]
            if char in ' \t':
                self.pos += 1
            else:
                break
    
    def expect(self, s: str):
        """Expect and consume a string, raising ParseError if not found."""
        self.skip_whitespace()
        if not self.text[self.pos:].startswith(s):
            raise ParseError(f"Expected '{s}' at position {self.pos}")
        self.pos += len(s)
    
    def parse_float(self) -> float:
        """Parse a signed float."""
        self.skip_whitespace()
        start = self.pos
        
        # Optional sign
        if self.peek() in '+-':
            self.consume()
        
        # Float: (1*DIGIT ["." *DIGIT]) / ("." 1*DIGIT)
        if self.peek() == '.':
            # Case: .7
            self.consume()
            if not self.peek().isdigit():
                raise ParseError(f"Expected digit after '.' at position {self.pos}")
            while self.peek().isdigit():
                self.consume()
        else:
            # Case: 0.7, 1.0, 0, 1
            if not self.peek().isdigit():
                raise ParseError(f"Expected digit at position {self.pos}")
            while self.peek().isdigit():
                self.consume()
            if self.peek() == '.':
                self.consume()
                while self.peek().isdigit():
                    self.consume()
        
        float_str = self.text[start:self.pos]
        try:
            return float(float_str)
        except ValueError:
            raise ParseError(f"Invalid float at position {start}")
    
    def parse_identifier(self) -> str:
        """Parse an identifier (ALPHA / DIGIT / "_" / "-")."""
        self.skip_whitespace()
        start = self.pos
        chars = []
        
        while self.pos < self.length:
            char = self.text[self.pos]
            if char.isalnum() or char in '_-':
                chars.append(char)
                self.pos += 1
            else:
                break
        
        if not chars:
            raise ParseError(f"Expected identifier at position {start}")
        
        return ''.join(chars)
    
    def parse_state(self) -> State:
        """Parse a state vector: E{...}"""
        self.skip_whitespace()
        self.expect('E')
        self.skip_whitespace()
        self.expect('{')
        self.skip_whitespace()
        
        values = []
        for i in range(8):
            if i > 0:
                self.skip_whitespace()
                self.expect(',')
                self.skip_whitespace()
            val = self.parse_float()
            values.append(val)
        
        self.skip_whitespace()
        self.expect('}')
        
        return State(values=values)
    
    def parse_macro(self) -> Macro:
        """Parse a macro identifier."""
        name = self.parse_identifier()
        return Macro(name=name)
    
    def parse_primary(self) -> ASTNode:
        """Parse a primary expression."""
        self.skip_whitespace()
        
        if self.peek() == 'E':
            return self.parse_state()
        elif self.peek() == '(':
            self.consume()  # '('
            self.skip_whitespace()
            expr = self.parse_expression()
            self.skip_whitespace()
            self.expect(')')
            return expr
        else:
            # Try macro
            return self.parse_macro()
    
    def parse_maskcall(self) -> MaskCall:
        """Parse mask(expr, m)"""
        self.expect('mask')
        self.skip_whitespace()
        self.expect('(')
        self.skip_whitespace()
        expr = self.parse_expression()
        self.skip_whitespace()
        self.expect(',')
        self.skip_whitespace()
        mask_val = self.parse_float()
        self.skip_whitespace()
        self.expect(')')
        return MaskCall(expr=expr, mask_value=mask_val)
    
    def parse_ctx(self) -> tuple[str, str]:
        """Parse ctx(tag) and return (tag, consumed_text)."""
        self.expect('ctx')
        self.skip_whitespace()
        self.expect('(')
        self.skip_whitespace()
        tag = self.parse_identifier()
        if not tag:
            raise ParseError("Empty context tag")
        self.skip_whitespace()
        self.expect(')')
        return tag
    
    def parse_masked(self) -> ASTNode:
        """Parse masked expression (maskcall or primary)."""
        self.skip_whitespace()
        
        # Check for mask(
        if self.text[self.pos:].startswith('mask'):
            # Save position to check
            saved_pos = self.pos
            try:
                return self.parse_maskcall()
            except ParseError:
                # Reset and try primary
                self.pos = saved_pos
                return self.parse_primary()
        else:
            return self.parse_primary()
    
    def parse_modulated(self) -> ASTNode:
        """Parse modulated expression (masked with optional context)."""
        expr = self.parse_masked()
        
        while True:
            self.skip_whitespace()
            # Check for ⊗ ctx(
            if self.pos < self.length - 4 and self.text[self.pos] == '⊗':
                self.consume()  # '⊗'
                self.skip_whitespace()
                tag = self.parse_ctx()
                expr = Context(expr=expr, tag=tag)
            else:
                break
        
        return expr
    
    def parse_conflict(self) -> ASTNode:
        """Parse conflict expression (modulated with optional ⟂)."""
        expr = self.parse_modulated()
        
        while True:
            self.skip_whitespace()
            if self.peek() == '⟂':
                self.consume()  # '⟂'
                self.skip_whitespace()
                right = self.parse_modulated()
                expr = Conflict(left=expr, right=right)
            else:
                break
        
        return expr
    
    def parse_blend(self) -> ASTNode:
        """Parse blend expression (conflict with optional ⊕)."""
        expr = self.parse_conflict()
        
        while True:
            self.skip_whitespace()
            if self.peek() == '⊕':
                self.consume()  # '⊕'
                self.skip_whitespace()
                right = self.parse_conflict()
                expr = Blend(left=expr, right=right)
            else:
                break
        
        return expr
    
    def parse_trajectory(self) -> ASTNode:
        """Parse trajectory expression (blend with optional →)."""
        expr = self.parse_blend()
        
        while True:
            self.skip_whitespace()
            if self.peek() == '→':
                self.consume()  # '→'
                self.skip_whitespace()
                right = self.parse_blend()
                expr = Transition(left=expr, right=right)
            else:
                break
        
        return expr
    
    def parse_expression(self) -> ASTNode:
        """Parse a complete E-Lang expression."""
        return self.parse_trajectory()
    
    def parse(self) -> ASTNode:
        """Parse the entire input."""
        self.skip_whitespace()
        result = self.parse_expression()
        self.skip_whitespace()
        
        if self.pos < self.length:
            raise ParseError(f"Unexpected characters at position {self.pos}: {self.text[self.pos:]}")
        
        return result


def parse(text: str) -> ASTNode:
    """
    Parse an E-Lang expression.
    
    Args:
        text: E-Lang expression string
        
    Returns:
        ASTNode: Parsed AST
        
    Raises:
        ParseError: If parsing fails
        ValidationError: If validation fails (e.g., out of range values)
    """
    parser = Parser(text)
    return parser.parse()


if __name__ == "__main__":
    # Simple test
    test_cases = [
        "E{0,0,0,0,0,0,0,0}",
        "E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}",
        "E{0,0,0,0,0,0,0,0} → E{0,0,0,0,0,0,0,0}",
        "E{0,0,0,0,0,0,0,0} ⊗ ctx(work)",
        "mask(E{0,0,0,0,0,0,0,0}, 0.7)",
        "ALARM ⊕ BOND",
    ]
    
    for test in test_cases:
        try:
            ast = parse(test)
            print(f"✓ {test}")
            print(f"  -> {ast.type}")
        except (ParseError, ValidationError) as e:
            print(f"✗ {test}")
            print(f"  -> Error: {e}")
