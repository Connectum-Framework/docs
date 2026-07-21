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

::: runtime
== node
```bash
# Check types
pnpm typecheck   # or: tsc --noEmit

# Watch mode for development
tsc --noEmit --watch
```
== bun
```bash
# Check types
bun run typecheck   # or: bunx tsc --noEmit

# Watch mode for development
bunx tsc --noEmit --watch
```
:::

## Development Workflow

::: runtime
== node
```bash
# Node.js 25+: start with auto-reload (watches for file changes)
node --watch src/index.ts

# tsx: start with auto-reload (Node.js 22+)
tsx --watch src/index.ts

# Type check in a separate terminal
tsc --noEmit --watch

# Or run once
pnpm typecheck && pnpm start
```
== bun
```bash
# Start with auto-reload (watches for file changes)
bun --watch src/index.ts

# Type check in a separate terminal
bunx tsc --noEmit --watch

# Or run once
bun run typecheck && bun run start
```
:::

## Checklist

Before running your Connectum service, verify:

- [ ] `"type": "module"` in `package.json`
- [ ] `verbatimModuleSyntax: true` in `tsconfig.json`
- [ ] `import type` for all type-only imports
- [ ] `node:` prefix for built-in modules

::: runtime
== node
- [ ] Node.js 25+ installed (`node --version`), or tsx installed (`npx tsx --version`)
- [ ] `erasableSyntaxOnly: true` in `tsconfig.json`
- [ ] No `enum` in application code (use `const` objects) -- type stripping cannot execute it
- [ ] `.ts` extensions in relative imports
- [ ] Proto enums handled via [two-step generation](/en/guide/typescript/proto-enums) (if applicable; not needed with tsx)
== bun
- [ ] Bun installed (`bun --version`)
- [ ] `.ts` extensions in relative imports (optional for Bun, but keeps the code portable to Node.js)

Bun transpiles TypeScript instead of stripping types, so `enum`, `namespace` and
parameter properties execute as written and proto enums need no extra generation step.
Keep to the erasable subset anyway if the same code has to run on Node.js.
:::

## Related

- [TypeScript Overview](/en/guide/typescript) -- back to overview
- [Erasable Syntax](/en/guide/typescript/erasable-syntax) -- constraints and tsconfig.json
- [Runtime Support](/en/guide/typescript/runtime-support) -- Node.js, Bun, tsx
- [Proto Enums](/en/guide/typescript/proto-enums) -- proto enum workaround
