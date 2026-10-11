# Development Setup

How to set up the development environment for contributing to Connectum.

## Requirements

- Node.js >= 25.2.0
- pnpm >= 11

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
node --version  # >= 25.2.0

# Check pnpm
pnpm --version  # >= 11

# Type checking
pnpm typecheck

# Run tests
pnpm test
```

### 4. Start Development

```bash
pnpm dev
```

## Upgrading OpenTelemetry dependencies

The `@connectum/otel` package declares its OpenTelemetry dependencies through the workspace catalog in `pnpm-workspace.yaml`. Update the catalog entries together when the SDK or exporters require a coordinated version change; then review the package's public exports and run its tests. For changes to a serializer or exporter path, compare representative telemetry output and performance before and after the upgrade.

## Further Resources

- [CLI Commands](./cli-commands) -- full command reference
- [About Connectum](/en/guide/about) -- framework architecture
