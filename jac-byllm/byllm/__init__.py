"""byLLM Package - Lazy Loading."""
import importlib.util
import sys

if importlib.util.find_spec("jaclang") is None:
    sys.stderr.write(
        "ImportError: jaclang is required for byLLM to function. "
        "Please install it via 'pip install jaclang', or reinstall byLLM.\n"
    )
    sys.exit(1)