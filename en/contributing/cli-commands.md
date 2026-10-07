---
title: Contributor Commands
description: Run framework builds, checks, code generation, and release tooling from the correct repository.
docType: contributor-guide
---

# CLI Commands Reference

## Overview

Commands for working with the Connectum framework repository. Run the examples below
from its root unless a block explicitly changes directories. Commands that update
dependencies, version packages, or publish releases change repository or registry state;
they are maintenance actions, not environment verification.

::: tip The `connectum` CLI
This page covers the monorepo development scripts. The published `@connectum/cli` tool
(`connectum init`, `connectum generate service`, `connectum proto sync`) is documented
in [Scaffolding a New Service](/en/guide/scaffolding). In short:

```bash
npx @connectum/cli init my-service      # scaffold a new project
npx @connectum/cli generate service x   # add a service to an existing project
```
:::

## Prerequisites

- **Node.js**: >=26.0.0 for framework development; application requirements are in [Runtime Compatibility](/en/guide/runtime-compatibility)
- **pnpm**: 11+
- **Buf**: provided by package devDependencies (no standalone install); proto generation runs via `pnpm exec turbo run build:proto`

### Installation Check

```bash
# Check Node.js version
node --version  # Should be >= 26.0.0 for framework development

# Check pnpm version
pnpm --version  # Should be >= 11.0.0

# Buf is bundled as a workspace devDependency; verify proto generation
pnpm exec turbo run build:proto
```

## Root-Level Commands

Commands are executed from the monorepo root.

### Installation

```bash
# Install all dependencies
pnpm install

# Install with frozen lockfile (CI/CD)
pnpm install --frozen-lockfile

# Update all dependencies
pnpm update

# Update specific package
pnpm update @connectum/core
```

### Build Commands

```bash
# Build all packages (tsup → dist/)
pnpm build

# Build specific package
pnpm --filter @connectum/core build

# Build only proto files
pnpm exec turbo run build:proto

# Remove package build outputs, root node_modules, and the Turbo cache
pnpm clean
```

Each package compiles TypeScript to JavaScript + type declarations (`dist/`) using tsup. The output includes source maps for IDE jump-to-source support.

### Type Checking

Build first: the root `typecheck` script runs `tsc --noEmit` directly and does not
schedule a build. Filtered package scripts also run directly, bypassing Turbo's
task dependencies.

```bash
pnpm build

# Type check all packages
pnpm typecheck

# Type check specific package
pnpm --filter @connectum/otel typecheck

# Watch mode (continuous type checking)
pnpm --filter @connectum/core typecheck --watch
```

### Testing

```bash
# Run all tests
pnpm test

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run tests for specific package
pnpm --filter @connectum/core test

# Run unit tests across packages
pnpm test:unit

# Run integration tests across packages
pnpm test:integration
```

### Protocol Interop Tests

These suites check gRPC Server Reflection, the Health service and `connectum proto sync` with clients that are not built on Connect: grpcurl, `buf curl` and `grpc_health_probe`. They are not part of `pnpm test`. CI runs them in the required `Protocol interop` check on every pull request.

They need Docker on Linux, because the clients reach the test server through the host network. Run the commands from the root of the framework repository (`connectum`), not from this documentation checkout.

```bash
# The CLI suite runs the built `connectum` binary
pnpm build

# Build the image with the pinned clients (cached after the first run)
pnpm interop:tools

# Run one suite per package
pnpm --filter @connectum/reflection test:interop
pnpm --filter @connectum/healthcheck test:interop
pnpm --filter @connectum/cli test:interop
```

The pinned client versions and the upstream protos the suites check against are listed in `tests/interop/README.md` in the framework repository.

### Linting and Formatting

```bash
# Check code style (Biome)
pnpm lint

# Fix code style issues
pnpm format

# Check specific package
pnpm --filter @connectum/interceptors lint

# Run Biome directly
pnpm exec biome check packages/core/src/

# Fix with Biome
pnpm exec biome check --write packages/core/src/
```

### Development

```bash
# Run all packages in development mode (parallel)
pnpm dev

# Run specific package
pnpm --filter @connectum/core dev

```

These scripts watch package entry points. They do not start an application server or
load an environment file; run an example service to exercise requests.

### Versioning and Release

```bash
# Create changeset (interactive)
pnpm changeset

# Version packages (update versions based on changesets)
pnpm changeset version

# Publish packages to npm
pnpm changeset publish

# Publish with specific tag
pnpm changeset publish --tag alpha
pnpm changeset publish --tag beta
```

### Documentation

```bash
# Generate API Reference from JSDoc comments (TypeDoc → docs/en/api/)
pnpm docs:api
```

With sibling framework and documentation checkouts, the generated API Reference is
written to `../docs/en/api/` and integrated into the sidebar through
`typedoc-sidebar.json`. TypeDoc warnings fail generation.

After installing and building the framework, optionally execute the Quickstart
and eight framework README examples against packed candidate packages:

```bash
pnpm docs:check --docs ../docs --examples ../examples
```

Run this from the framework repository with sibling `docs` and `examples`
checkouts, or pass their explicit paths. It installs a temporary consumer project
and resolves Buf imports, so network access is required. This selected-example
check complements source review and site validation; it does not cover every
documentation claim or snippet.

## Package-Level Commands

Commands for working with individual packages.

### Navigation

```bash
# Navigate to package directory
cd packages/core

# Or use pnpm filter
pnpm --filter @connectum/core <command>
```

### Common Package Scripts

Check the target package's `package.json` for its available scripts. Build,
typecheck, test, lint, format, and clean are common; `start`, `dev`, `test:unit`, and
`test:integration` are package-specific.

```bash
# Run the package entry point, where defined (not an application server)
pnpm start

# Development mode with watch
pnpm dev

# Build package
pnpm build

# Type check
pnpm typecheck

# Run tests
pnpm test
pnpm test:unit
pnpm test:integration

# Lint
pnpm lint

# Clean build outputs
pnpm clean
```

### Package-Specific Commands

#### @connectum/core

```bash
# Check the core package
pnpm --filter @connectum/core test

# Development with watch
pnpm --filter @connectum/core dev

# Run integration tests
pnpm --filter @connectum/core test:integration
```

#### @connectum/cli

```bash
# Run CLI commands
pnpm --filter @connectum/cli start

# Show CLI help after pnpm build
pnpm --filter @connectum/cli start --help
```

#### examples/ (directory, not a package)

The examples repository is a sibling checkout, not a directory in the monorepo.
This sequence starts in the framework root:

```bash
cd ../examples/getting-started
pnpm install
pnpm start

# After stopping the service: generate proto files before watch mode
pnpm buf:generate
pnpm dev
```

## Turbo Commands

Turborepo orchestration commands.

### Run Tasks

```bash
# Run task for all packages
pnpm exec turbo run build
pnpm exec turbo run test
pnpm exec turbo run typecheck

# Run task for specific package
pnpm exec turbo run build --filter=@connectum/core

# Run in parallel
pnpm exec turbo run build --parallel

# Force (ignore cache)
pnpm exec turbo run build --force

# Dry run (show what would run)
pnpm exec turbo run build --dry-run
```

### Cache Management

```bash
# Rebuild without reading cached results (does not delete the cache)
pnpm exec turbo run build --force

# Or manually delete
rm -rf .turbo
```

## pnpm Workspace Commands

### Filtering

```bash
# Run command in specific package
pnpm --filter @connectum/core <command>

# Run in all packages matching pattern
pnpm --filter "@connectum/*" build

# Run in package and dependencies
pnpm --filter @connectum/core... build

# Run in package and dependents
pnpm --filter ...@connectum/otel build
```

### Dependencies

```bash
# List all dependencies
pnpm list

# List dependencies for specific package
pnpm --filter @connectum/core list

# Show dependency tree
pnpm list --depth 3

# Why is package installed?
pnpm why @bufbuild/protobuf

# Outdated packages
pnpm outdated

# Update interactive
pnpm update -i
```

### Workspace Management

```bash
# Add dependency to specific package
pnpm --filter @connectum/core add @connectrpc/connect

# Add dev dependency
pnpm --filter @connectum/core add -D typescript

# Add workspace dependency
pnpm --filter @connectum/core add @connectum/otel@workspace:^

# Remove dependency
pnpm --filter @connectum/core remove @connectrpc/connect

# Link all workspace packages
pnpm install
```

## Development Workflow Commands

### New Package Setup

```bash
# Create package directory
mkdir -p packages/my-package/{src,tests}

# Create package.json
cat > packages/my-package/package.json <<EOF
{
    "name": "@connectum/my-package",
    "version": "1.0.0",
    "type": "module",
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "scripts": {
        "build": "tsup"
    },
    "engines": {
        "node": ">=22.13.0"
    }
}
EOF

# Create tsconfig.json
cat > packages/my-package/tsconfig.json <<EOF
{
    "extends": "../../tsconfig.packages.json"
}
EOF

```

This is a metadata skeleton, not a complete package. Add `src/index.ts`,
`tsup.config.ts`, the package's test and check scripts, and its required dependencies
(including `tsup` and `typescript`) before installing and building it. Use an existing
package as the repository-specific template.

### Proto Generation

```bash
# Generate all proto files
pnpm exec turbo run build:proto
```

### TLS Keys Generation

```bash
# Generate development TLS certificates
pnpm generate:keys

# Manual generation
mkdir -p keys
openssl req -nodes -x509 -newkey rsa:2048 -days 3650 \
    -subj "/CN=localhost" \
    -keyout keys/server.key \
    -out keys/server.crt \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

### Testing Workflows

```bash
# Run the tests defined for a package
pnpm --filter @connectum/core test

# Run only that package's unit tests
pnpm --filter @connectum/core test:unit
```

### Debugging

```bash
# Run with Node.js debugger
node --inspect src/index.ts

# Run with breakpoint
node --inspect-brk src/index.ts

# Verbose logging
NODE_DEBUG=* node src/index.ts

# TypeScript type checking verbose
pnpm typecheck -- --extendedDiagnostics
```

## CI/CD Commands

Commands typically used in CI/CD pipelines.

### GitHub Actions

```bash
# Install dependencies (frozen lockfile)
pnpm install --frozen-lockfile

# Build before checking imports
pnpm build

# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Run all tests
pnpm test

# Publish only as part of the configured release process
pnpm changeset publish
```

### Docker Build

The framework root `Dockerfile` uses a private base image and does not start a service.
For application images and runnable container examples, follow
[Docker Deployment](/en/guide/production/docker) or an example's README.

## Troubleshooting Commands

### Clean Everything

```bash
# Clean package outputs, the root dependencies, and the Turbo cache
pnpm clean

# Remove node_modules
rm -rf node_modules packages/*/node_modules

# Clean pnpm store
pnpm store prune

# Reinstall dependencies without deleting the lockfile
pnpm install --force
```

### Verify Setup

```bash
# Verify Node.js version
node --version

# Verify pnpm workspace
pnpm list --depth 0

# Verify proto generation (Buf via the @bufbuild/buf workspace devDependency)
pnpm exec turbo run build:proto

# Verify Biome
pnpm exec biome --version
```

### Performance Analysis

```bash
# Turbo performance analysis
pnpm exec turbo run build --profile

# Bundle size analysis
pnpm --filter @connectum/core exec du -sh node_modules

# Dependency analysis
pnpm why <package-name>

# Find duplicate dependencies
pnpm dedupe
```

## Advanced Commands

### Monorepo Utilities

```bash
# Run command in all packages
pnpm -r exec <command>

# Example: update all package versions
pnpm -r exec npm version patch

# Run command in parallel
pnpm -r --parallel exec <command>

# Run script in all packages
pnpm -r run build
```

### Git Hooks (Husky)

```bash
# Install git hooks
pnpm prepare

# Skip git hooks (not recommended)
git commit --no-verify -m "message"

# Validate a Conventional Commit message explicitly
echo "feat: test message" | pnpm exec commitlint
```

### Environment Management

The monorepo's `dev` script does not load `.env`, and there is no root `start` script.
Configure environment loading in the application that calls `createServer()`. See
[Environment Configuration](/en/guide/server/configuration) for supported framework
variables and their interaction with explicit options.

## Quick Reference

### Most Used Commands

```bash
# Development workflow
pnpm install          # Install dependencies
pnpm dev              # Start development
pnpm build            # Build before type checking
pnpm typecheck        # Check types
pnpm test             # Run tests
pnpm lint             # Check code style

# Build and release
pnpm build            # Build all packages
pnpm changeset        # Create changeset
pnpm changeset version    # Bump versions
pnpm changeset publish    # Publish to npm

# Cleanup
pnpm clean            # Clean build outputs
rm -rf node_modules   # Remove dependencies
pnpm install          # Reinstall
```

### Package Filters Cheat Sheet

```bash
# Specific package
pnpm --filter @connectum/core <cmd>

# Multiple packages
pnpm --filter @connectum/{core,interceptors} <cmd>

# All packages matching pattern
pnpm --filter "@connectum/*" <cmd>

# Package and dependencies
pnpm --filter @connectum/core... <cmd>

# Package and dependents
pnpm --filter ...@connectum/otel <cmd>

# Exclude pattern
pnpm --filter "!@connectum/testing" <cmd>
```

## References

- **Turborepo Docs**: https://turbo.build/repo/docs
- **pnpm Workspaces**: https://pnpm.io/workspaces
- **pnpm Filtering**: https://pnpm.io/filtering
- **Node.js Test Runner**: https://nodejs.org/api/test.html
- **Biome CLI**: https://biomejs.dev/reference/cli/

## See Also

- [About Connectum](/en/guide/about) -- System architecture
- [Development Setup](./development-setup) -- Environment setup guide
