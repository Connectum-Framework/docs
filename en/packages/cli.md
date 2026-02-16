---
title: '@connectum/cli'
description: CLI tools for Connectum -- proto sync via gRPC Server Reflection
---

# @connectum/cli

Command-line tools for the Connectum framework. Currently provides the `proto sync` command -- a pipeline that connects to a running Connectum server via gRPC Server Reflection, discovers all services and proto definitions, and generates TypeScript client types using `buf generate`.

**Layer**: 3 (Development Tools)

## Installation

```bash
pnpm add -D @connectum/cli
```

**Requires**: Node.js 18+, `buf` CLI available on PATH

**Built with**: [citty](https://github.com/unjs/citty) for CLI framework

## Quick Start

```bash
# Dry run: list discovered services and files
npx connectum proto sync --from localhost:5000 --out ./gen --dry-run

# Full sync: generate TypeScript types from a running server
npx connectum proto sync --from localhost:5000 --out ./gen
```

## Commands

### `connectum proto sync`

Syncs proto type definitions from a running Connectum server via gRPC Server Reflection.

#### Pipeline

1. Connects to the server via `ServerReflectionClient`
2. Discovers all services and builds a `FileRegistry`
3. Serializes the file descriptors as a `FileDescriptorSet` binary (`.binpb`)
4. Runs `buf generate` with the `.binpb` as input
5. Cleans up temporary files

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `--from` | `string` | Yes | Server address (e.g., `localhost:5000` or `http://localhost:5000`) |
| `--out` | `string` | Yes | Output directory for generated types |
| `--template` | `string` | No | Path to custom `buf.gen.yaml` template |
| `--dry-run` | `boolean` | No | Show what would be synced without generating code |

#### Examples

```bash
# Basic sync
npx connectum proto sync --from localhost:5000 --out ./src/gen

# With custom buf template
npx connectum proto sync \
  --from localhost:5000 \
  --out ./src/gen \
  --template ./buf.gen.custom.yaml

# Dry run to inspect services
npx connectum proto sync --from http://localhost:5000 --out ./gen --dry-run
```

#### Dry Run Output

```
Connecting to http://localhost:5000...
Connected to http://localhost:5000

Services:
  - grpc.health.v1.Health
  - my.service.v1.MyService
  - grpc.reflection.v1.ServerReflection

Files:
  - google/protobuf/descriptor.proto
  - grpc/health/v1/health.proto
  - my/service/v1/service.proto

Would generate to: ./gen
```

## API Reference

The CLI exports its internals for programmatic usage:

### `executeProtoSync(options)`

Execute the proto sync pipeline programmatically.

```typescript
import { executeProtoSync } from '@connectum/cli/commands/proto-sync';

await executeProtoSync({
  from: 'http://localhost:5000',
  out: './src/gen',
  template: './buf.gen.yaml',
  dryRun: false,
});
```

```typescript
interface ProtoSyncOptions {
  from: string;       // Server URL
  out: string;        // Output directory
  template?: string;  // Custom buf.gen.yaml path
  dryRun?: boolean;   // Preview mode
}
```

### Reflection Utilities

```typescript
import {
  fetchReflectionData,
  fetchFileDescriptorSetBinary,
} from '@connectum/cli/utils/reflection';
```

#### `fetchReflectionData(url)`

Fetches service and file descriptor information from a running server.

```typescript
const result = await fetchReflectionData('http://localhost:5000');
console.log(result.services);   // ['grpc.health.v1.Health', ...]
console.log(result.fileNames);  // ['grpc/health/v1/health.proto', ...]
console.log(result.registry);   // FileRegistry instance
```

```typescript
interface ReflectionResult {
  services: string[];
  registry: FileRegistry;
  fileNames: string[];
}
```

#### `fetchFileDescriptorSetBinary(url)`

Fetches `FileDescriptorSet` as binary (`.binpb`) suitable for `buf generate` input.

```typescript
const binpb = await fetchFileDescriptorSetBinary('http://localhost:5000');
writeFileSync('/tmp/descriptors.binpb', binpb);
// Then: buf generate /tmp/descriptors.binpb --output ./gen
```

## Prerequisites

The `proto sync` command requires:

1. **A running Connectum server** with the `Reflection()` protocol enabled
2. **buf CLI** installed and available on PATH (`pnpm add -D @bufbuild/buf`)
3. **A `buf.gen.yaml`** in the working directory (or specified via `--template`)

Example `buf.gen.yaml`:

```yaml
version: v2
plugins:
  - local: protoc-gen-es
    out: .
    opt:
      - target=ts
      - import_extension=.js
```

## Package Exports

```json
{
  ".": "./src/index.ts",
  "./commands/proto-sync": "./src/commands/proto-sync.ts",
  "./utils/reflection": "./src/utils/reflection.ts"
}
```

## Related Packages

- **[@connectum/reflection](./reflection.md)** -- Server-side reflection protocol (required for `proto sync`)
- **[@connectum/core](./core.md)** -- Server framework
