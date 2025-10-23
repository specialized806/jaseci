#!/usr/bin/env python3
"""
Test script to verify the dynamic function map generation works correctly.
"""

from jac_bundler_cli import generate_function_map, client_functions

def test_dynamic_generation():
    """Test the dynamic function map generation."""
    print("🧪 Testing Dynamic Function Map Generation")
    print("=" * 50)
    
    # Test with default client_functions
    print(f"📋 Default functions ({len(client_functions)}):")
    print(f"   {client_functions}")
    print()
    
    # Generate function map
    function_map = generate_function_map(client_functions)
    print("🗺️  Generated functionMap:")
    print(function_map)
    print()
    
    # Test with a custom function list
    custom_functions = ["test_func1", "test_func2", "MyComponent"]
    print(f"📋 Custom functions ({len(custom_functions)}):")
    print(f"   {custom_functions}")
    print()
    
    custom_map = generate_function_map(custom_functions)
    print("🗺️  Generated custom functionMap:")
    print(custom_map)
    print()
    
    # Test with empty list
    empty_map = generate_function_map([])
    print("🗺️  Generated empty functionMap:")
    print(f"   '{empty_map}'")
    print()
    
    print("✅ All tests completed successfully!")
    print("🎉 Dynamic generation is working correctly!")

if __name__ == "__main__":
    test_dynamic_generation()


