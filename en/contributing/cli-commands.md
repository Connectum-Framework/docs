# CLI Commands Reference

## Overview

Complete reference of CLI commands for working with the Connectum monorepo.

## Prerequisites

- **Node.js**: 25+ (for development), 18+ (for consumers)
- **pnpm**: 10+
- **protoc**: Latest version for proto generation

### Installation Check

```bash
# Check Node.js version
node --version  # Should be 25+ for development

# Check pnpm version
pnpm --version  # Should be >= 10.0.0

# Check protoc version
protoc --version  # Should be installed
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
pnpm build:proto

# Clean all build outputs
pnpm clean
```

Each package compiles TypeScript to JavaScript + type declarations (`dist/`) using tsup. The output includes source maps for IDE jump-to-source support.

### Type Checking

```bash
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

# Run tests with coverage
pnpm test -- --coverage

# Watch mode
pnpm --filter @connectum/core test -- --watch
```

### Linting and Formatting

```bash
# Check code style (Biome)
pnpm lint

# Fix code style issues
pnpm format

# Check specific package
pnpm --filter @connectum/interceptors lint

# Run Biome directly
biome check src/

# Fix with Biome
biome check --write src/
```

### Development

```bash
# Run all packages in development mode (parallel)
pnpm dev

# Run specific package
pnpm --filter @connectum/core dev

# Run with environment file
pnpm --filter @connectum/core dev
```

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

# Or use the convenience script from workspace root (Connectum/)
./gen-api-docs.sh

# Skip proto rebuild if already done
./gen-api-docs.sh --skip-proto
```

The generated API Reference is output to `docs/en/api/` and integrates with VitePress sidebar automatically via `typedoc-sidebar.json`.

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

Most packages support:

```bash
# Start package (production mode)
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
# Start server example
pnpm --filter @connectum/core start

# Development with watch
pnpm --filter @connectum/core dev

# Run integration tests
pnpm --filter @connectum/core test:integration
```

#### @connectum/cli

```bash
# Run CLI commands
pnpm --filter @connectum/cli start

# Development with watch
pnpm --filter @connectum/cli dev
```

#### examples/ (directory, not a package)

```bash
# Run basic example
node examples/basic-service/src/index.ts

# Run example with custom interceptor
node examples/with-custom-interceptor/src/index.ts

# Development mode with watch
node --watch examples/basic-service/src/index.ts
```

## Turbo Commands

Turborepo orchestration commands.

### Run Tasks

```bash
# Run task for all packages
turbo run build
turbo run test
turbo run typecheck

# Run task for specific package
turbo run build --filter=@connectum/core

# Run in parallel
turbo run build --parallel

# Force (ignore cache)
turbo run build --force

# Dry run (show what would run)
turbo run build --dry-run
```

### Cache Management

```bash
# Clear turbo cache
turbo run build --force

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
    "main": "./src/index.ts"
}
EOF

# Create tsconfig.json
cat > packages/my-package/tsconfig.json <<EOF
{
    "extends": "../../tsconfig.packages.json"
}
EOF

# Install dependencies from workspace root
pnpm install
```

### Proto Generation

```bash
# Generate all proto files
pnpm build:proto
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
# Run tests and generate coverage
pnpm test -- --coverage

# View coverage report
open coverage/lcov-report/index.html

# Run specific test file
pnpm --filter @connectum/core test -- tests/Server.test.ts

# Run tests matching pattern
pnpm test -- --grep "should handle errors"

# Run tests with increased timeout
pnpm test -- --timeout 10000
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

# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Run all tests with coverage
pnpm test -- --coverage

# Build all packages
pnpm build

# Publish (requires npm token)
pnpm changeset publish
```

### Docker Build

```bash
# Build Docker image
docker build -t connectum:latest .

# Build with specific Dockerfile
docker build -f Dockerfile.alpine -t connectum:alpine .

# Build for specific platform
docker buildx build --platform linux/amd64,linux/arm64 -t connectum:latest .

# Run container
docker run -p 5000:5000 connectum:latest
```

## Troubleshooting Commands

### Clean Everything

```bash
# Clean all build outputs and caches
pnpm clean

# Remove node_modules
rm -rf node_modules packages/*/node_modules

# Clean pnpm store
pnpm store prune

# Fresh install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Verify Setup

```bash
# Verify Node.js version
node --version

# Verify TypeScript can be stripped
node --eval "import './test.ts'" 2>&1 | grep -q "Error" || echo "Type stripping works!"

# Verify pnpm workspace
pnpm list --depth 0

# Verify proto compiler
protoc --version

# Verify Biome
biome --version
```

### Performance Analysis

```bash
# Turbo performance analysis
turbo run build --profile

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

# Test commit message
echo "feat: test message DEV-123" | pnpm commitlint
```

### Environment Management

```bash
# Load environment from file
export $(cat .env | xargs) && pnpm dev

# Run with environment variables
PORT=3000 NODE_ENV=production pnpm start

# Use .env file
pnpm --filter @connectum/core dev  # Automatically loads .env
```

## Quick Reference

### Most Used Commands

```bash
# Development workflow
pnpm install          # Install dependencies
pnpm dev              # Start development
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

- [Architecture Overview](/en/guide/advanced/architecture) -- System architecture
- [Development Setup](./development-setup) -- Environment setup guide
