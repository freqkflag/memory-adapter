# E-Lang Parser Test Suite

## Purpose

This document defines test cases for E-Lang parser implementation. The parser should validate syntax according to `ELANG.abnf` and `ELANG_SPEC.md`.

## Test Categories

### 1. Valid State Vectors

#### Basic State Vector
```
Input: E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}
Expected: Valid parse, returns state vector with 8 axis values
```

#### State Vector with Zero Values
```
Input: E{0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0}
Expected: Valid parse, neutral state
```

#### State Vector with Extreme Values
```
Input: E{-1.0,+1.0,-1.0,+1.0,-1.0,+1.0,-1.0,+1.0}
Expected: Valid parse, all axes at extremes
```

### 2. Invalid State Vectors

#### Missing Values
```
Input: E{-0.4,+0.7,-0.2}
Expected: Parse error (insufficient axis values)
```

#### Out of Range Values
```
Input: E{-1.5,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}
Expected: Validation error (value outside [-1.0, +1.0])
```

#### Invalid Format
```
Input: E{-0.4,0.7,-0.2,-0.6,-0.1,-0.3,0.8,0.2}
Expected: Parse error or warning (missing braces, commas, etc.)
```

### 3. Masking Operator

#### Valid Mask Expression
```
Input: mask(E{-0.4,+0.7,-0.2,-0.6,-0.1,-0.3,+0.8,+0.2}, E{0.0,0.3,0.0,0.0,0.0,0.0,0.0,0.0})
Expected: Valid parse, returns masked state
```

#### Mask with Out of Range Values
```
Input: mask(E{0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5}, E{1.5,0.0,0.0,0.0,0.0,0.0,0.0,0.0})
Expected: Validation error (mask value outside [0.0, 1.0])
```

### 4. Context Application

#### Valid Context Expression
```
Input: E{0.5,0.3,0.2,0.1,0.0,0.0,0.0,0.0} ⊗ ctx(workplace)
Expected: Valid parse, returns context-modified state
```

#### Context with Invalid Identifier
```
Input: E{0.5,0.3,0.2,0.1,0.0,0.0,0.0,0.0} ⊗ ctx(123invalid)
Expected: Parse error (invalid identifier format)
```

### 5. Composition Operators

#### Additive Composition
```
Input: E{0.5,0.3,0.0,0.0,0.0,0.0,0.0,0.0} ⊕ E{0.2,0.1,0.4,0.0,0.0,0.0,0.0,0.0}
Expected: Valid parse, returns composed state
```

#### Orthogonal Composition
```
Input: E{0.5,0.3,0.0,0.0,0.0,0.0,0.0,0.0} ⟂ E{0.2,0.1,0.4,0.0,0.0,0.0,0.0,0.0}
Expected: Valid parse, returns orthogonally composed state
```

#### Composition Clamping
```
Input: E{0.8,0.8,0.0,0.0,0.0,0.0,0.0,0.0} ⊕ E{0.5,0.5,0.0,0.0,0.0,0.0,0.0,0.0}
Expected: Valid parse, result clamped to [-1.0, +1.0]
```

### 6. Transition Operator

#### Valid Transition
```
Input: E{-0.8,-0.6,-0.4,-0.7,0.0,0.0,0.0,0.0} → E{-0.2,0.1,0.3,0.2,0.0,0.0,0.0,0.0}
Expected: Valid parse, returns transition representation
```

#### Right Associativity
```
Input: E1 → E2 → E3
Expected: Valid parse as (E1 → (E2 → E3))
```

### 7. Operator Precedence

#### Precedence Test 1
```
Input: mask(E{0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5}, E{0.0,0.3,0.0,0.0,0.0,0.0,0.0,0.0}) ⊕ E{0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2}
Expected: Valid parse as (mask(...) ⊕ E{...})
```

#### Precedence Test 2
```
Input: E{0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5} ⊗ ctx(x) → E{0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0}
Expected: Valid parse as ((E{...} ⊗ ctx(x)) → E{...})
```

#### Parentheses Override
```
Input: E1 ⊕ (E2 → E3)
Expected: Valid parse, transition evaluated before composition
```

### 8. Complex Expressions

#### Nested Operations
```
Input: mask(E{0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5} ⊕ E{0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2}, E{0.0,0.3,0.0,0.0,0.0,0.0,0.0,0.0})
Expected: Valid parse, composition evaluated before masking
```

#### Multiple Operators
```
Input: E1 ⊗ ctx(x) ⊕ E2 → E3
Expected: Valid parse according to precedence rules
```

### 9. Whitespace Handling

#### Whitespace Tolerance
```
Input: E { -0.4 , +0.7 , -0.2 , -0.6 , -0.1 , -0.3 , +0.8 , +0.2 }
Expected: Valid parse (whitespace ignored)
```

#### Newline Tolerance
```
Input: E{-0.4,+0.7,-0.2,-0.6,
        -0.1,-0.3,+0.8,+0.2}
Expected: Valid parse (newlines ignored)
```

## Implementation Notes

### Parser Requirements
- Validate syntax according to ELANG.abnf
- Validate value ranges (state vectors: [-1.0, +1.0], masks: [0.0, 1.0])
- Enforce operator precedence
- Handle associativity correctly
- Provide clear error messages

### Test Implementation
- Tests should be implementable in any language
- Use standard testing frameworks
- Include both positive and negative test cases
- Test edge cases (boundary values, extreme values)

### Future Extensions
- Temporal annotations for transitions
- Macro expansion tests
- Context function evaluation tests
- Performance benchmarks

## Test Status

- [ ] Parser implementation exists
- [ ] Test suite implemented
- [ ] All tests passing
- [ ] Edge cases covered
- [ ] Error handling validated
