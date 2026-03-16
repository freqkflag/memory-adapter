#!/usr/bin/env python3
"""
E-Lang JSON Schema Validator

Validates JSON data against E-Lang JSON Schemas.
Performs structure validation only; no interpretation or evaluation.

Usage:
    python3 tools/validate_json.py --schema elang_state.schema.json data.json
    python3 tools/validate_json.py --schema elang_ast.schema.json ast.json
"""

import json
import sys
import argparse
from pathlib import Path


def validate_json(data_path, schema_path):
    """Validate JSON data against a JSON Schema."""
    try:
        # Load schema
        with open(schema_path, 'r') as f:
            schema = json.load(f)
        
        # Load data
        with open(data_path, 'r') as f:
            data = json.load(f)
        
        # Validate using jsonschema if available, otherwise basic structure check
        try:
            import jsonschema
            jsonschema.validate(instance=data, schema=schema)
            print(f"✓ Valid: {data_path} conforms to {schema_path}")
            return 0
        except ImportError:
            # Fallback: basic JSON structure validation
            print("Warning: jsonschema not installed. Install with: pip install jsonschema")
            print("Performing basic JSON structure check only...")
            # Basic validation: JSON is valid
            print(f"✓ JSON is valid: {data_path}")
            return 0
            
    except json.JSONDecodeError as e:
        print(f"✗ Invalid JSON: {e}", file=sys.stderr)
        return 1
    except FileNotFoundError as e:
        print(f"✗ File not found: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"✗ Validation error: {e}", file=sys.stderr)
        return 1


def main():
    parser = argparse.ArgumentParser(
        description="Validate JSON data against E-Lang JSON Schemas",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 tools/validate_json.py --schema elang_state.schema.json data.json
  python3 tools/validate_json.py --schema elang_ast.schema.json ast.json

Note: This tool validates structure only. It does not interpret or evaluate E-Lang expressions.
        """
    )
    parser.add_argument(
        '--schema',
        required=True,
        help='Path to JSON Schema file (elang_state.schema.json or elang_ast.schema.json)'
    )
    parser.add_argument(
        'data',
        help='Path to JSON data file to validate'
    )
    
    args = parser.parse_args()
    
    # Resolve paths relative to repo root
    repo_root = Path(__file__).parent.parent
    schema_path = repo_root / args.schema
    data_path = repo_root / args.data
    
    if not schema_path.exists():
        print(f"✗ Schema file not found: {schema_path}", file=sys.stderr)
        return 1
    
    if not data_path.exists():
        print(f"✗ Data file not found: {data_path}", file=sys.stderr)
        return 1
    
    return validate_json(data_path, schema_path)


if __name__ == '__main__':
    sys.exit(main())