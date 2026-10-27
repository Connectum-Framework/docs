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
3. **[Pull Requests](/en/contributing/pull-requests)** -- fork, branch, checks, changesets, and review
4. **[Commit Messages](/en/contributing/commit-messages)** -- Conventional Commits, scopes, and breaking changes
5. **[Code Style](/en/contributing/code-style)** -- what Biome and the compiler enforce, and which rules are conventions
6. **[Testing the Framework](/en/contributing/testing)** -- test layout, runners, and integration suites that need brokers
7. **[Documentation Style Guide](/en/contributing/documentation-style)** -- how to write package READMEs and docs pages
8. **[About Connectum](/en/guide/about)** -- understand the package layers and design

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
- Node.js `>=26.0.0` for framework development; see [Runtime Compatibility](/en/guide/runtime-compatibility) for application requirements.

Details and the list of what is enforced by a tool: [Code Style](/en/contributing/code-style).

### Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/) format; see [Commit Messages](/en/contributing/commit-messages)
- One logical change per commit
- Run `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm lint`, and `pnpm lint:repo` before opening a pull request; see [Pull Requests](/en/contributing/pull-requests).

### Architecture Decision Records

Significant design decisions are documented as ADRs in the [ADR index](/en/contributing/adr/index). When proposing a change that affects the architecture, create a new ADR.

## Quick Commands

```bash
cd connectum

pnpm install          # Install dependencies
pnpm build            # Build package dependencies before type checking
pnpm typecheck        # Type check all packages
pnpm test             # Run all tests
pnpm lint             # Check code style
pnpm lint:repo        # Check repository files outside package source
pnpm format           # Auto-fix formatting
pnpm changeset        # Create a changeset for versioning
```
