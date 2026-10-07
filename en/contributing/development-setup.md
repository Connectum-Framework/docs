---
title: Development Setup
description: Clone the Connectum repositories and verify the framework contributor environment.
docType: contributor-guide
---

# Development Setup

How to set up the development environment for contributing to Connectum.

## Requirements

- Node.js >= 26.0.0 for the framework repository
- pnpm >= 11; use the version pinned in the framework's `package.json`

These are contributor requirements. Application runtime requirements are listed in
[Runtime Compatibility](/en/guide/runtime-compatibility).

## Quick Start

### 1. Clone Repositories

```bash
# Create root directory
mkdir Connectum && cd Connectum

# Clone all 3 repositories
git clone https://github.com/Connectum-Framework/connectum.git
git clone https://github.com/Connectum-Framework/docs.git
git clone https://github.com/Connectum-Framework/examples.git
```

### 2. Install Dependencies

```bash
cd connectum
pnpm install
```

### 3. Verify Environment

```bash
# Check Node.js
node --version  # >= 26.0.0

# Check pnpm
pnpm --version  # >= 11

# Build dependencies before checking package imports
pnpm build

# Type checking
pnpm typecheck

# Run tests
pnpm test

# Lint package source and the rest of the repository
pnpm lint
pnpm lint:repo
```

### 4. Start Development

```bash
pnpm dev
```

This runs the packages that define a `dev` script. It watches their entry points;
it does not start an application service. To run a service, follow the
[Quickstart](/en/guide/quickstart) or a README in the examples repository.

## Upgrading OpenTelemetry dependencies

The `@connectum/otel` package declares its OpenTelemetry dependencies through the workspace catalog in `pnpm-workspace.yaml`. Update the catalog entries together when the SDK or exporters require a coordinated version change; then review the package's public exports and run its tests. For changes to a serializer or exporter path, compare representative telemetry output and performance before and after the upgrade.

## Further Resources

- [CLI Commands](/en/contributing/cli-commands) -- contributor command reference
- [About Connectum](/en/guide/about) -- framework architecture
