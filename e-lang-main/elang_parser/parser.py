"""
E-Lang Expression Parser

Recursive descent parser following ELANG.abnf grammar.
Parses full E-Lang expressions into AST without interpretation.
"""

import re
from typing import Optional
from elang_parser.ast import State, Macro, Context, MaskCall, BinaryOp, Expr
from elang_parser.validate import validate_state, validate_mask

# Regex for parsing states (preserved from original)
STATE_RE = re.compile(
    r"E\{\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*,\s*"
    r"([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*,\s*"
    r"([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*,\s*"
    r"([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*\}"
)


class Parser:
    """Recursive descent parser for E-Lang expressions."""
    
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
        """Skip whitespace (SP, HTAB): wsp = 1*( SP / HTAB )"""
        while self.pos < self.length:
            char = self.text[self.pos]
            if char in ' \t':
                self.pos += 1
            else:
                break
    
    def expect(self, s: str):
        """Expect and consume a string, raising ValueError if not found."""
        self.skip_whitespace()
        if not self.text[self.pos:].startswith(s):
            raise ValueError(f"Expected '{s}' at position {self.pos}")
        self.pos += len(s)
    
    def parse_float(self) -> float:
        """
        Parse a signed float.
        signedfloat = [sign] float
        float = ( 1*DIGIT ["." *DIGIT] ) / ( "." 1*DIGIT )
        """
        self.skip_whitespace()
        start = self.pos
        
        # Optional sign
        sign = 1
        if self.peek() in '+-':
            if self.peek() == '-':
                sign = -1
            self.consume()
        
        # Float: (1*DIGIT ["." *DIGIT]) / ("." 1*DIGIT)
        if self.peek() == '.':
            # Case: .7
            self.consume()
            if not self.peek().isdigit():
                raise ValueError(f"Expected digit after '.' at position {self.pos}")
            while self.peek().isdigit():
                self.consume()
        else:
            # Case: 0.7, 1.0, 0, 1
            if not self.peek().isdigit():
                raise ValueError(f"Expected digit at position {self.pos}")
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
            raise ValueError(f"Invalid float at position {start}")
    
    def parse_identifier(self) -> str:
        """
        Parse an identifier: 1*( ALPHA / DIGIT / "_" / "-" )
        Used for tags and macros.
        """
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
            raise ValueError(f"Expected identifier at position {start}")
        
        return ''.join(chars)
    
    def parse_state(self) -> State:
        """
        Parse a state vector: E wsp? "{" wsp? vlist wsp? "}"
        vlist = 8 axisval separated by commas
        """
        self.skip_whitespace()
        self.expect('E')
        self.skip_whitespace()
        self.expect('{')
        self.skip_whitespace()
        
        # Parse exactly 8 axis values
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
        
        validate_state(values)
        return State(values=values)
    
    def parse_macro(self) -> Macro:
        """Parse a macro identifier."""
        name = self.parse_identifier()
        return Macro(name=name)
    
    def parse_ctx(self) -> Context:
        """
        Parse context annotation: "ctx" wsp? "(" wsp? tag wsp? ")"
        tag = 1*( ALPHA / DIGIT / "_" / "-" )
        """
        self.expect('ctx')
        self.skip_whitespace()
        self.expect('(')
        self.skip_whitespace()
        tag = self.parse_identifier()
        if not tag:
            raise ValueError("Empty context tag")
        self.skip_whitespace()
        self.expect(')')
        return Context(tag=tag)
    
    def parse_maskcall(self) -> MaskCall:
        """
        Parse mask call: "mask" wsp? "(" wsp? expression wsp? "," wsp? maskvalue wsp? ")"
        """
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
        
        validate_mask(mask_val)
        return MaskCall(expr=expr, value=mask_val)
    
    def parse_primary(self) -> Expr:
        """
        Parse primary expression: state / "(" wsp? expression wsp? ")" / macro
        """
        self.skip_whitespace()
        
        # Check for state (E{...})
        if self.peek() == 'E':
            return self.parse_state()
        
        # Check for parenthesized expression
        if self.peek() == '(':
            self.consume()  # '('
            self.skip_whitespace()
            expr = self.parse_expression()
            self.skip_whitespace()
            self.expect(')')
            return expr
        
        # Otherwise, try macro
        return self.parse_macro()
    
    def parse_masked(self) -> Expr:
        """
        Parse masked expression: maskcall / primary
        """
        self.skip_whitespace()
        
        # Check for mask(
        saved_pos = self.pos
        if self.text[self.pos:].startswith('mask'):
            try:
                return self.parse_maskcall()
            except ValueError:
                # Reset and try primary
                self.pos = saved_pos
                return self.parse_primary()
        else:
            return self.parse_primary()
    
    def parse_modulated(self) -> Expr:
        """
        Parse modulated expression: masked *( wsp? "⊗" wsp? ctx )
        Left-associative.
        """
        expr = self.parse_masked()
        
        while True:
            self.skip_whitespace()
            if self.peek() == '⊗':
                self.consume()  # '⊗'
                self.skip_whitespace()
                ctx = self.parse_ctx()
                expr = BinaryOp(left=expr, op='⊗', right=ctx)
            else:
                break
        
        return expr
    
    def parse_conflict(self) -> Expr:
        """
        Parse conflict expression: modulated *( wsp? "⟂" wsp? modulated )
        Left-associative.
        """
        expr = self.parse_modulated()
        
        while True:
            self.skip_whitespace()
            if self.peek() == '⟂':
                self.consume()  # '⟂'
                self.skip_whitespace()
                right = self.parse_modulated()
                expr = BinaryOp(left=expr, op='⟂', right=right)
            else:
                break
        
        return expr
    
    def parse_blend(self) -> Expr:
        """
        Parse blend expression: conflict *( wsp? "⊕" wsp? conflict )
        Left-associative.
        """
        expr = self.parse_conflict()
        
        while True:
            self.skip_whitespace()
            if self.peek() == '⊕':
                self.consume()  # '⊕'
                self.skip_whitespace()
                right = self.parse_conflict()
                expr = BinaryOp(left=expr, op='⊕', right=right)
            else:
                break
        
        return expr
    
    def parse_trajectory(self) -> Expr:
        """
        Parse trajectory expression: blend *( wsp? "→" wsp? blend )
        Left-associative.
        """
        expr = self.parse_blend()
        
        while True:
            self.skip_whitespace()
            if self.peek() == '→':
                self.consume()  # '→'
                self.skip_whitespace()
                right = self.parse_blend()
                expr = BinaryOp(left=expr, op='→', right=right)
            else:
                break
        
        return expr
    
    def parse_expression(self) -> Expr:
        """
        Parse a complete E-Lang expression.
        expression = trajectory
        """
        return self.parse_trajectory()
    
    def parse(self) -> Expr:
        """Parse the entire input."""
        self.skip_whitespace()
        result = self.parse_expression()
        self.skip_whitespace()
        
        if self.pos < self.length:
            raise ValueError(f"Unexpected characters at position {self.pos}: {repr(self.text[self.pos:])}")
        
        return result


# Preserve existing parse_state function for backward compatibility
def parse_state(text: str) -> State:
    """
    Parse a state vector only (backward compatibility).
    
    For full expression parsing, use parse_expression() instead.
    """
    parser = Parser(text)
    result = parser.parse()
    if not isinstance(result, State):
        raise ValueError("parse_state() only accepts state vectors, not full expressions")
    return result


def parse_expression(text: str) -> Expr:
    """
    Parse a complete E-Lang expression.
    
    Args:
        text: E-Lang expression string
        
    Returns:
        Expr: Parsed AST (State, Macro, MaskCall, BinaryOp, or Context)
        
    Raises:
        ValueError: If parsing fails
    """
    parser = Parser(text)
    return parser.parse()