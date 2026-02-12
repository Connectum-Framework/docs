# ADR-001: Native TypeScript Execution

## Status

**Accepted** - 2025-12-22

## Context

Connectum is a universal framework for building gRPC/ConnectRPC microservices. When developing the new version, we needed to choose a TypeScript execution strategy.

### Requirements

1. **Type Safety**: Full typing to prevent runtime errors
2. **Developer Experience**: Fast feedback loop, strong IDE support
3. **Production Ready**: Reliability, stability, minimal overhead
4. **Performance**: Critical for high-throughput systems (300+ req/min)
5. **Simplicity**: Minimal tooling and build steps

Node.js 22.6.0+ added type stripping support, which became **stable in 25.2.0+**:

```bash
# Node.js 25.2.0+: STABLE and enabled by default
node src/index.ts
```

## Decision

**We choose Native TypeScript (Type Stripping) for Connectum.**

### Requirements

- **Node.js version**: `>=25.2.0` (requirement in package.json engines)
- **TypeScript version**: `>=5.8.0` for type checking
- **Type stripping**: Enabled by default (no flags needed)

### TypeScript Configuration

Following official Node.js recommendations:

```json
{
  "compilerOptions": {
    "noEmit": true,
    "target": "esnext",
    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Key settings**:
- `noEmit: true` -- type checking only, no compilation
- `allowImportingTsExtensions: true` -- lets the type checker process `.ts` extensions in imports
- `rewriteRelativeImportExtensions: true` -- forward-compatibility option; rewrites `.ts` to `.js` in emitted output if compilation is enabled in the future
- `erasableSyntaxOnly: true` -- prevents use of non-erasable syntax
- `verbatimModuleSyntax: true` -- requires explicit `import type`

> Both `allowImportingTsExtensions` and `rewriteRelativeImportExtensions` work together: the first lets the type checker understand `.ts` imports with `noEmit: true`, the second ensures a fallback to tsc compilation would produce correct `.js` imports.

### Package.json Scripts

```json
{
  "type": "module",
  "scripts": {
    "start": "node src/index.ts",
    "dev": "node --watch src/index.ts",
    "typecheck": "tsc --noEmit",
    "test": "node --test tests/**/*.test.ts"
  },
  "engines": {
    "node": ">=25.2.0"
  }
}
```

### Syntax Restrictions

#### Enum -- use const objects

```typescript
// NOT supported (non-erasable)
export enum Status { SERVING = 1 }

// Correct
export const ServingStatus = {
  UNKNOWN: 0,
  SERVING: 1,
  NOT_SERVING: 2,
} as const;

export type ServingStatus = typeof ServingStatus[keyof typeof ServingStatus];
```

#### Namespace -- use ES Modules

```typescript
// NOT supported
namespace MyNamespace { export const value = 1; }

// Correct
export const value = 1;
```

#### Mandatory import type

```typescript
// Correct
import type { ServiceType } from '@bufbuild/protobuf';
import { createPromiseClient } from '@connectrpc/connect';

// Incorrect -- may cause errors
import { ServiceType } from '@bufbuild/protobuf';
```

#### Import extensions must be .ts

Per Node.js documentation, file extensions are **mandatory** and must match the actual file extension.

```typescript
// Correct
import { myFunction } from './utils.ts';

// Incorrect -- no extension
import { myFunction } from './utils';

// Incorrect -- wrong extension for a .ts file
import { myFunction } from './utils.js';
```

#### Parameter Properties -- use explicit properties

```typescript
// NOT supported
class User {
  constructor(public name: string, private age: number) {}
}

// Correct
class User {
  name: string;
  private age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

#### Decorators -- not supported

Neither legacy TypeScript decorators nor TC39 Stage 3 decorators work with native type stripping. Node.js strips types but does **not** transform decorators. Use wrapper functions instead.

#### Path Aliases -- use package.json#imports

Node.js does **not** read `tsconfig.json` at runtime. Use `package.json#imports` instead of tsconfig paths:

```json
{
  "imports": {
    "#utils/*": "./src/utils/*.ts",
    "#types/*": "./src/types/*.ts"
  }
}
```

```typescript
import { helper } from '#utils/helper.ts';
```

## Consequences

### Positive

1. **Zero Build Step** -- instant startup (`node src/index.ts`), hot reload (`node --watch`), simplified CI/CD
2. **Performance** -- minimal parsing overhead compared to pure JS; no JIT compilation overhead (unlike ts-node/tsx); smaller memory footprint
3. **Type Safety** -- full TypeScript types, IDE auto-completion, compile-time checking via `tsc --noEmit`
4. **Developer Experience** -- instant feedback loop, no watch compilation lag, no `dist/` directory
5. **Production Ready** -- stable feature in Node.js 25.2.0+, officially supported and documented. Node.js 25.x is a Current release (not LTS); future LTS: 26.x (Current from April 2026, LTS from October 2026)
6. **Simplified Tooling** -- no webpack/rollup/esbuild, no ts-node/tsx runtime dependencies, fewer dependencies = fewer security vulnerabilities

### Negative

1. **Node.js Version Requirement** -- requires >=25.2.0, may be problematic for legacy environments. Mitigated by explicit `engines` in package.json, CI/CD checks, Docker images with Node.js 25.2.0+
2. **TypeScript Syntax Limitations** -- no enum, no namespace, no parameter properties, mandatory `import type`. Mitigated by documented migration patterns and Biome lint rules
3. **Ecosystem Compatibility** -- some libraries may not support native TS; generated proto code may need adaptation. Mitigated by dual export (`types` + `default` pointing to `.ts` source) and a fallback plan to add pre-compiled `dist/` if needed
4. **Learning Curve** -- developers must learn erasable vs non-erasable syntax and new patterns for enum/namespace replacements

### Rollback Plan

If native TypeScript proves unsuitable, adding a compilation step is ~1-2 days of work:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

Erasable syntax makes this migration trivial.

## Alternatives Considered

### Alternative 1: Traditional tsc compilation

**Rating**: 6/10. Stable and production-proven, but build step overhead is not justified for modern Node.js runtime.

### Alternative 2: ts-node / tsx for development + tsc for production

**Rating**: 7/10. Fast development, but environment mismatch risks between dev and prod, plus extra dependencies.

### Alternative 3: Deno / Bun

**Rating**: 4/10. Native TypeScript support, but ConnectRPC + Node.js ecosystem is too valuable to abandon.

### Alternative 4: Keep JavaScript

**Rating**: 3/10. Zero setup, but no type safety -- critical for a production framework.

## References

1. [Official Node.js TypeScript Documentation](https://nodejs.org/api/typescript.md)
2. Node.js 25.2.0 Release Notes -- type stripping became STABLE, enabled by default
3. [TypeScript 5.8 Compiler Options](https://www.typescriptlang.org/tsconfig)
4. [TC39 Type Annotations Proposal](https://github.com/tc39/proposal-type-annotations)

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-22 | Claude | Initial ADR |
