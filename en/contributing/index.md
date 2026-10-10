---
title: Contributing
description: Set up a Connectum development environment and find contributor commands and documentation rules.
docType: contributor-guide
---

# Contributing to Connectum

Use these guides to set up the repositories, run framework checks, and follow the project conventions.

## Where to Start

1. **[Development Setup](/en/contributing/development-setup)** -- clone repos, install dependencies, run tests
2. **[CLI Commands](/en/contributing/cli-commands)** -- all commands for working with the monorepo
3. **[Documentation Style Guide](/en/contributing/documentation-style)** -- how to write package READMEs and docs pages
4. **[About Connectum](/en/guide/about)** -- understand the package layers and design

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
- Node.js `>=25.2.0` for development; published packages require `>=22.13.0`.

### Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/) format
- One logical change per commit
- Run `pnpm build`, `pnpm typecheck`, `pnpm test`, and `pnpm lint` before opening a pull request.

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
