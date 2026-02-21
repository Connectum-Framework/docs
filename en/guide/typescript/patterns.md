---
outline: deep
---

# Patterns & Workflow

Common TypeScript patterns used throughout Connectum and the recommended development workflow.

## Named Parameters

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

## Const Objects Instead of Enums

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

## Branded Types

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

## Strict Null Checks

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

## Related

- [TypeScript Overview](/en/guide/typescript) -- back to overview
- [Erasable Syntax](/en/guide/typescript/erasable-syntax) -- constraints and tsconfig.json
- [Runtime Support](/en/guide/typescript/runtime-support) -- Node.js, Bun, tsx
- [Proto Enums](/en/guide/typescript/proto-enums) -- proto enum workaround
