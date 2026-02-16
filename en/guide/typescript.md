---
title: TypeScript Best Practices
description: Native TypeScript execution constraints, patterns, and configuration for Connectum services on Node.js 25+.
outline: deep
---

# TypeScript Best Practices

Connectum packages are published as **compiled JavaScript** (`.js` + `.d.ts` + source maps), built with [tsup](https://tsup.egoist.dev/). Consumers can use any runtime that supports ES modules (Node.js 18+, Bun, tsx). Framework developers still write native TypeScript using [stable type stripping](https://nodejs.org/api/typescript.html) on Node.js 25+, which introduces specific constraints described below.

## Runtime Support: Node.js vs Bun vs tsx {#runtime-support-node-js-vs-bun}

Connectum packages ship **compiled JavaScript** with TypeScript declarations (`.d.ts`) and source maps. This means **no special loader or register hook is needed** for any runtime -- all runtimes can import `@connectum/*` packages directly.

### Node.js 25+

Node.js 25+ supports [type stripping](https://nodejs.org/api/typescript.html) for your own `.ts` source files. Since `@connectum/*` packages ship compiled `.js`, no loader is required:

```bash
node src/index.ts
```

In `package.json`:

```json
{
  "scripts": {
    "start": "node src/index.ts",
    "dev": "node --watch src/index.ts"
  }
}
```

#### What Packages Ship

Each `@connectum/*` package is built with [tsup](https://tsup.egoist.dev/) and publishes:

- **Compiled `.js` files** (ESM) -- ready to run on any ES module-capable runtime
- **TypeScript declarations** (`.d.ts`) -- full type information for IDE support and type checking
- **Source maps** (`.js.map`) -- accurate stack traces pointing to the original TypeScript source

### Bun

Bun natively supports TypeScript for your own source files. Since `@connectum/*` packages ship compiled `.js`, everything works out of the box:

```bash
bun src/index.ts
```

In `package.json`:

```json
{
  "scripts": {
    "start": "bun src/index.ts",
    "dev": "bun --watch src/index.ts"
  }
}
```

### tsx (Node.js 18+)

[tsx](https://tsx.is) is a TypeScript execution engine powered by [esbuild](https://esbuild.github.io/). It works as a drop-in replacement for `node` and runs on **Node.js 18+**, making it a good option when you cannot use Node.js 25+. Since `@connectum/*` packages ship compiled `.js`, no special configuration is needed.

```bash
npx tsx src/index.ts
```

In `package.json`:

```json
{
  "scripts": {
    "start": "tsx src/index.ts",
    "dev": "tsx --watch src/index.ts"
  }
}
```

::: tip
Install tsx as a devDependency (`pnpm add -D tsx`) for faster invocation without `npx`.
:::

### Comparison

| Feature | Node.js 25+ | Bun | tsx (Node.js 18+) |
|---------|------------|-----|-------------------|
| Your `.ts` files | Native type stripping | Native | esbuild |
| `@connectum/*` packages | Compiled `.js` (no loader needed) | Compiled `.js` (no loader needed) | Compiled `.js` (no loader needed) |
| `--watch` mode | `node --watch` | `bun --watch` | `tsx --watch` |
| Proto enum support | Requires [two-step generation](#proto-generation-and-enums) | Native | Native (esbuild) |
| Min Node.js version | 25.2.0 (for native `.ts` execution) | N/A (Bun runtime) | 18.0.0 |

### Docker

In Dockerfiles, use the appropriate `CMD` for your runtime:

```dockerfile
# Node.js 25+ (native TypeScript for your own .ts files)
CMD ["node", "src/index.ts"]

# Bun
CMD ["bun", "src/index.ts"]

# tsx (Node.js 18+)
CMD ["npx", "tsx", "src/index.ts"]
```

## How Native TypeScript Works

Node.js 25+ can execute `.ts` files directly by **stripping type annotations** at load time. This is **not** full TypeScript compilation -- it only removes type syntax, leaving the remaining JavaScript intact.

```bash
# Run TypeScript directly -- no tsc needed
node src/index.ts
```

The key implication: your TypeScript code must be valid JavaScript after type annotations are removed. This is called **erasable syntax only**.

## The erasableSyntaxOnly Constraint

Enable this in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "erasableSyntaxOnly": true
  }
}
```

This makes TypeScript's type checker enforce that you only use syntax that can be erased, catching violations at development time.

### What You Cannot Use

The following TypeScript features generate runtime code and **cannot** be erased:

#### No `enum`

```typescript
// WRONG: enum generates runtime code
enum Status {
  PENDING = 1,
  ACTIVE = 2,
  CLOSED = 3,
}

// CORRECT: use const object with 'as const'
const Status = {
  PENDING: 1,
  ACTIVE: 2,
  CLOSED: 3,
} as const;

type Status = typeof Status[keyof typeof Status];
// Status = 1 | 2 | 3
```

This pattern gives you:
- Type safety (same as enum)
- Runtime values (accessible in code)
- String literal type via `keyof typeof`
- No extra compilation step

#### No `namespace` with Runtime Code

```typescript
// WRONG: namespace with runtime value
namespace MyApp {
  export const version = '1.0.0';
}

// CORRECT: use a module
export const version = '1.0.0';
```

::: tip
Type-only namespaces (containing only types/interfaces) are allowed since they are fully erasable:

```typescript
// OK: type-only namespace
namespace MyTypes {
  export interface Config {
    port: number;
  }
}
```
:::

#### No Parameter Properties

```typescript
// WRONG: parameter properties generate assignment code
class Server {
  constructor(private port: number) {}
}

// CORRECT: explicit property declaration
class Server {
  private port: number;
  constructor(port: number) {
    this.port = port;
  }
}
```

#### No Legacy Decorators

Legacy (experimental) decorators are not erasable. TC39 stage 3 decorators are supported in newer Node.js versions:

```typescript
// WRONG: legacy decorator
@Injectable()
class UserService {}

// OK: TC39 stage 3 decorators (if supported by your Node.js version)
```

## Import Rules

### Explicit `import type`

With `verbatimModuleSyntax: true`, you must separate type imports from value imports:

```typescript
// CORRECT: explicit type import
import type { ConnectRouter } from '@connectrpc/connect';
import type { SayHelloRequest } from '#gen/greeter_pb.js';

// CORRECT: value import
import { create } from '@bufbuild/protobuf';
import { GreeterService } from '#gen/greeter_pb.js';

// CORRECT: mixed import with inline type
import { GreeterService, type SayHelloRequest } from '#gen/greeter_pb.js';

// WRONG: type imported as value (caught by verbatimModuleSyntax)
import { SayHelloRequest } from '#gen/greeter_pb.js';
//       ^ This is a type, must use 'import type'
```

### File Extensions in Imports

Use `.ts` extensions in relative imports of source files. The `rewriteRelativeImportExtensions` option handles module resolution:

```typescript
// CORRECT: .ts extension for source files
import { greeterServiceRoutes } from './services/greeterService.ts';
import type { Config } from './config.ts';

// CORRECT: no extension for package imports
import { createServer } from '@connectum/core';
import { create } from '@bufbuild/protobuf';

// WRONG: .js extension for source files (outdated convention)
import { greeterServiceRoutes } from './services/greeterService.js';

// WRONG: no extension for relative imports
import { greeterServiceRoutes } from './services/greeterService';
```

### Generated Code (`#gen/`) Imports

Generated protobuf files (`#gen/*`) always use `.js` extensions. This is the convention set by `protobuf-es` (`import_extension=.js` in `buf.gen.yaml`):

```typescript
// CORRECT: .js for generated protobuf files
import { GreeterService } from '#gen/greeter_pb.js';
import type { SayHelloRequest } from '#gen/greeter_pb.js';
import routes from '#gen/routes.js';

// WRONG: .ts for generated files
import { GreeterService } from '#gen/greeter_pb.ts';
```

The `#gen/` path alias is defined in `package.json` via the `imports` field (`"#gen/*": "./gen/*"`).

### Node.js Built-in Modules

Always use the `node:` prefix for Node.js built-in modules:

```typescript
// CORRECT
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';

// WRONG: no node: prefix
import { readFileSync } from 'fs';
```

## tsconfig.json Configuration

Here is the recommended `tsconfig.json` for Connectum projects:

```json
{
  "compilerOptions": {
    // No compilation -- TypeScript runs natively
    "noEmit": true,

    // ECMAScript and module targets
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",

    // Native TypeScript execution constraints
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "rewriteRelativeImportExtensions": true,

    // Strict type checking
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts", "gen/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Key Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| `noEmit` | `true` | No compilation output -- TypeScript is for type checking only |
| `erasableSyntaxOnly` | `true` | Enforce erasable-only syntax |
| `verbatimModuleSyntax` | `true` | Require explicit `import type` |
| `rewriteRelativeImportExtensions` | `true` | Allow `.ts` extensions in imports |
| `module` | `nodenext` | Node.js ESM module system |
| `moduleResolution` | `nodenext` | Node.js module resolution algorithm |

## Proto Generation and Enums

Proto files commonly use `enum`, which generates non-erasable TypeScript. The workaround is a two-step generation process.

### The Problem

`protoc-gen-es` generates TypeScript `enum` declarations for proto enums:

```protobuf
// In your .proto file
enum OrderStatus {
  ORDER_STATUS_UNSPECIFIED = 0;
  ORDER_STATUS_PENDING = 1;
  ORDER_STATUS_SHIPPED = 2;
}
```

This generates:

```typescript
// Generated code -- NOT erasable
export enum OrderStatus {
  UNSPECIFIED = 0,
  PENDING = 1,
  SHIPPED = 2,
}
```

Node.js cannot execute this directly because `enum` generates runtime code.

### The Two-Step Workaround

1. Generate TypeScript to a temporary directory (`gen-ts/`)
2. Compile with `tsc` to produce JavaScript in `gen/`

```json
{
  "scripts": {
    "build:proto": "protoc -I proto --plugin=protoc-gen-es=./node_modules/.bin/protoc-gen-es --es_out=gen-ts --es_opt=target=ts proto/*.proto",
    "build:proto:compile": "tsc -p tsconfig.gen.json",
    "build:proto:all": "pnpm build:proto && pnpm build:proto:compile"
  }
}
```

Create `tsconfig.gen.json` for the compilation step:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "declaration": true,
    "outDir": "gen",
    "rootDir": "gen-ts"
  },
  "include": ["gen-ts/**/*.ts"]
}
```

### Avoiding the Workaround

If you control your proto definitions, you can avoid `enum` entirely:

```protobuf
// Instead of enum, use int32 constants
message Order {
  int32 status = 1;
  // Constants defined in documentation:
  // 0 = UNSPECIFIED
  // 1 = PENDING
  // 2 = SHIPPED
}
```

Then define constants in TypeScript:

```typescript
const OrderStatus = {
  UNSPECIFIED: 0,
  PENDING: 1,
  SHIPPED: 2,
} as const;

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
```

::: info Future improvement
This workaround is temporary. When Node.js adds native `enum` support (or `protoc-gen-es` offers an option to generate `as const` objects), the two-step process will no longer be needed.
:::

## Common Patterns

### Named Parameters

Prefer objects with named properties over positional parameters:

```typescript
// CORRECT: named parameters
async function createOrder(options: {
  userId: string;
  items: OrderItem[];
  priority?: number;
}): Promise<Order> {
  // ...
}

await createOrder({ userId: '123', items: [...] });

// AVOID: positional parameters (hard to read)
async function createOrder(
  userId: string,
  items: OrderItem[],
  priority?: number,
): Promise<Order> {
  // ...
}
```

### Const Objects Instead of Enums

The standard pattern throughout Connectum:

```typescript
// Define the const object
export const ServerState = {
  CREATED: 'created',
  STARTING: 'starting',
  RUNNING: 'running',
  STOPPING: 'stopping',
  STOPPED: 'stopped',
} as const;

// Derive the union type
export type ServerState = typeof ServerState[keyof typeof ServerState];
// ServerState = 'created' | 'starting' | 'running' | 'stopping' | 'stopped'

// Usage
function handleState(state: ServerState) {
  if (state === ServerState.RUNNING) {
    // ...
  }
}
```

### Branded Types

For type-safe identifiers:

```typescript
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

function getUser(id: UserId): User { ... }
function getOrder(id: OrderId): Order { ... }

// Compile-time safety: can't pass OrderId where UserId is expected
const userId = '123' as UserId;
const orderId = '456' as OrderId;

getUser(userId);    // OK
getUser(orderId);   // Compile error!
```

### Strict Null Checks

Always handle nullable values explicitly:

```typescript
// The server address is null until started
const port = server.address?.port;
if (port === undefined) {
  throw new Error('Server not started');
}
console.log(`Listening on port ${port}`);
```

## Type Checking

Run type checking as a separate step (not compilation):

```bash
# Check types
pnpm typecheck   # or: tsc --noEmit

# Watch mode for development
tsc --noEmit --watch
```

## Development Workflow

```bash
# Node.js 25+: start with auto-reload (watches for file changes)
node --watch src/index.ts

# Bun: start with auto-reload
bun --watch src/index.ts

# tsx: start with auto-reload (Node.js 18+)
tsx --watch src/index.ts

# Type check in a separate terminal
tsc --noEmit --watch

# Or run once
pnpm typecheck && pnpm start
```

## Checklist

Before running your Connectum service, verify:

- [ ] Node.js 25+ installed (`node --version`), Bun installed (`bun --version`), or tsx installed (`npx tsx --version`)
- [ ] `"type": "module"` in `package.json`
- [ ] `erasableSyntaxOnly: true` in `tsconfig.json`
- [ ] `verbatimModuleSyntax: true` in `tsconfig.json`
- [ ] No `enum` in application code (use `const` objects)
- [ ] `import type` for all type-only imports
- [ ] `.ts` extensions in relative imports
- [ ] `node:` prefix for built-in modules
- [ ] Proto enums handled via two-step generation (if applicable, Node.js only; not needed for Bun or tsx)

## Next Steps

- [Quickstart](/en/guide/quickstart) -- build a service from scratch
- [Interceptors](/en/guide/interceptors) -- customize the interceptor chain
- [Observability](/en/guide/observability) -- add tracing and metrics
