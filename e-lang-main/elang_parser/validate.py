def validate_state(values):
    if len(values) != 8:
        raise ValueError("State must have exactly 8 axis values")
    for v in values:
        if not -1.0 <= v <= 1.0:
            raise ValueError(f"Axis value out of range: {v}")


def validate_mask(value):
    if not 0.0 <= value <= 1.0:
        raise ValueError(f"Mask value out of range: {value}")