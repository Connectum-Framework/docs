---
title: Contributing
description: How to contribute to the Connectum framework -- guidelines, setup, and conventions.
---

# Contributing to Connectum

Thank you for your interest in contributing to Connectum! This guide will help you get started.

## Where to Start

1. **[Development Setup](/en/contributing/development-setup)** -- clone repos, install dependencies, run tests
2. **[CLI Commands](/en/contributing/cli-commands)** -- all commands for working with the monorepo
3. **[Architecture Overview](/en/guide/advanced/architecture)** -- understand the package layers and design

## Repository Structure

Connectum is organized as 3 independent repositories under the [Connectum-Framework](https://github.com/Connectum-Framework) GitHub organization:

| Repository | Description |
|-----------|-------------|
| [connectum](https://github.com/Connectum-Framework/connectum) | Framework code -- pnpm workspace monorepo |
| [docs](https://github.com/Connectum-Framework/docs) | Documentation site (VitePress) |
| [examples](https://github.com/Connectum-Framework/examples) | Usage examples |

## Guidelines

### Code Style

- **Biome** for linting and formatting (`pnpm lint` / `pnpm format`)
- **Native TypeScript** -- no `enum`, explicit `import type`, `.ts` extensions
- **Named parameters** -- prefer options objects over positional arguments
- Node.js 25+ required for development (consumers: Node.js 18+)

### Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/) format
- One logical change per commit
- Run `pnpm typecheck && pnpm test` before committing

### Architecture Decision Records

Significant design decisions are documented as ADRs in the [ADR index](/en/contributing/adr/index). When proposing a change that affects the architecture, create a new ADR.

## Quick Commands

```bash
cd connectum

pnpm install          # Install dependencies
pnpm typecheck        # Type check all packages
pnpm test             # Run all tests
pnpm lint             # Check code style
pnpm format           # Auto-fix formatting
pnpm changeset        # Create a changeset for versioning
```
