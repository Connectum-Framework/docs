---
outline: deep
---

# Erasable Syntax

Node.js 25+ executes `.ts` files directly by **stripping type annotations** at load time. This is **not** full TypeScript compilation -- it only removes type syntax, leaving the remaining JavaScript intact. Your TypeScript code must be valid JavaScript after type annotations are removed.

## How Native TypeScript Works

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

## What You Cannot Use

The following TypeScript features generate runtime code and **cannot** be erased:

### No `enum`

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

### No `namespace` with Runtime Code

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

### No Parameter Properties

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

### No Legacy Decorators

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

## Related

- [TypeScript Overview](/en/guide/typescript) -- back to overview
- [Runtime Support](/en/guide/typescript/runtime-support) -- Node.js, Bun, tsx comparison
- [Proto Enums](/en/guide/typescript/proto-enums) -- workaround for proto enum generation
- [Patterns & Workflow](/en/guide/typescript/patterns) -- common TypeScript patterns
