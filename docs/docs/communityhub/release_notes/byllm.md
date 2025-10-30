# byLLM Release Notes

This document provides a summary of new features, improvements, and bug fixes in each version of **byLLM** (formerly MTLLM). For details on changes that might require updates to your existing code, please refer to the [Breaking Changes](../breaking_changes.md) page.


## jaclang 0.9.0 / jac-cloud 0.2.11 / byllm 0.4.6 / jac-client 0.1.0 (Unreleased)

## jaclang 0.8.10 / jac-cloud 0.2.10 / byllm 0.4.5 (Latest Release)

- **byLLM Lazy Loading**: Refactored byLLM to support lazy loading by moving all exports to `byllm.lib` module. Users should now import from `byllm.lib` in Python (e.g., `from byllm.lib import Model, by`) and use `import from byllm.lib { Model }` in Jac code. This improves startup performance and reduces unnecessary module loading.
- **NonGPT Fallback for byLLM**: Implemented automatic fallback when byLLM is not installed. When code attempts to import `byllm`, the system will provide mock implementations that return random using the `NonGPT.random_value_for_type()` utility.

## jaclang 0.8.9 / jac-cloud 0.2.9 / byllm 0.4.4

- **`is` Keyword for Semstrings**: Added support for using `is` as an alternative to `=` in semantic string declarations (e.g., `sem MyObject.value is "A value stored in MyObject"`).
- **byLLM Plugin Interface Improved**: Enhanced the byLLM plugin interface with `get_mtir` function hook interface and refactored the `by` decorator to use the plugin system, improving integration and extensibility.

## jaclang 0.8.8 / jac-cloud 0.2.8 / byllm 0.4.3

- **byLLM Enhancements**:
  - Fixed bug with Enums without values not being properly included in prompts (e.g., `enum Tell { YES, NO }` now works correctly).

## jaclang 0.8.7 / jac-cloud 0.2.7 / byllm 0.4.2

- **byLLM transition**: MTLLM has been transitioned to byLLM and PyPi package is renamed to `byllm`. Github actions are changed to push byllm PyPi. Alongside an mtllm PyPi will be pushed which installs latest `byllm` and produces a deprecation warning when imported as `mtllm`.
- **byLLM Feature Methods as Tools**: byLLM now supports adding methods of classes as tools for the llm using such as `tools=[ToolHolder.tool]`

## jaclang 0.8.6 / jac-cloud 0.2.6 / byllm 0.4.1

- **byLLM transition**: MTLLM has been transitioned to byLLM and PyPi package is renamed to `byllm`. Github actions are changed to push byllm PyPi. Alongside an mtllm PyPi will be pushed which installs latest `byllm` and produces a deprecation warning when imported as `mtllm`.

## jaclang 0.8.5 / jac-cloud 0.2.5 / mtllm 0.4.0

- **Removed LLM Override**: `function_call() by llm()` has been removed as it was introduce ambiguity in the grammer with LALR(1) shift/reduce error. This feature will be reintroduced in a future release with a different syntax.

## jaclang 0.8.4 / jac-cloud 0.2.4 / mtllm 0.3.9

## jaclang 0.8.3 / jac-cloud 0.2.3 / mtllm 0.3.8

- **Semantic Strings**: Introduced `sem` strings to attach natural language descriptions to code elements like functions, classes, and parameters. These semantic annotations can be used by Large Language Models (LLMs) to enable intelligent, AI-powered code generation and execution. (mtllm)
- **LLM Function Overriding**: Introduced the ability to override any regular function with an LLM-powered implementation at runtime using the `function_call() by llm()` syntax. This allows for dynamic, on-the-fly replacement of function behavior with generative models. (mtllm)

## jaclang 0.8.1 / jac-cloud 0.2.1 / mtllm 0.3.6

## Version 0.8.0
