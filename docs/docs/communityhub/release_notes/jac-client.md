# Jac-Client Release Notes

This document provides a summary of new features, improvements, and bug fixes in each version of **Jac-Client**. For details on changes that might require updates to your existing code, please refer to the [Breaking Changes](../breaking_changes.md) page.

## jaclang 0.9.0 / jac-cloud 0.2.11 / byllm 0.4.6 / jac-client 0.1.0 (Unreleased)

- **Client Bundler Plugin Support**: Extended the existing `pluggy`-based plugin architecture to support custom client bundling implementations. Two static methods were added to `JacMachineInterface` to enable client bundler plugins:
  - `get_client_bundle_builder()`: Returns the client bundle builder instance, allowing plugins to provide custom bundler implementations
  - `build_client_bundle()`: Builds client bundles for modules, can be overridden by plugins to use custom bundling strategies

- **ViteBundlerPlugin (jac-client)**: Official Vite-based bundler plugin providing production-ready JavaScript bundling with HMR, tree shaking, code splitting, TypeScript support, and asset optimization. Implements the `build_client_bundle()` hook to replace default bundling with Vite's optimized build system. Install `jac-client` library from the source and use it for automatic Vite-powered client bundle generation.

## jaclang 0.8.10 / jac-cloud 0.2.10 / byllm 0.4.5 (Latest Release)

## jaclang 0.8.9 / jac-cloud 0.2.9 / byllm 0.4.4

## jaclang 0.8.8 / jac-cloud 0.2.8 / byllm 0.4.3

## jaclang 0.8.7 / jac-cloud 0.2.7 / byllm 0.4.2

## jaclang 0.8.6 / jac-cloud 0.2.6 / byllm 0.4.1

## jaclang 0.8.5 / jac-cloud 0.2.5 / mtllm 0.4.0

## jaclang 0.8.4 / jac-cloud 0.2.4 / mtllm 0.3.9

## jaclang 0.8.3 / jac-cloud 0.2.3 / mtllm 0.3.8

## jaclang 0.8.1 / jac-cloud 0.2.1 / mtllm 0.3.6

## Version 0.8.0
