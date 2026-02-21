---
outline: deep
---

# Runtime Support

Connectum packages ship **compiled JavaScript** with TypeScript declarations (`.d.ts`) and source maps. This means **no special loader or register hook is needed** for any runtime -- all runtimes can import `@connectum/*` packages directly.

## Node.js 25+

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

### What Packages Ship

Each `@connectum/*` package is built with [tsup](https://tsup.egoist.dev/) and publishes:

- **Compiled `.js` files** (ESM) -- ready to run on any ES module-capable runtime
- **TypeScript declarations** (`.d.ts`) -- full type information for IDE support and type checking
- **Source maps** (`.js.map`) -- accurate stack traces pointing to the original TypeScript source

## Bun

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

## tsx (Node.js 18+)

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

## Comparison

| Feature | Node.js 25+ | Bun | tsx (Node.js 18+) |
|---------|------------|-----|-------------------|
| Your `.ts` files | Native type stripping | Native | esbuild |
| `@connectum/*` packages | Compiled `.js` (no loader needed) | Compiled `.js` (no loader needed) | Compiled `.js` (no loader needed) |
| `--watch` mode | `node --watch` | `bun --watch` | `tsx --watch` |
| Proto enum support | Requires [two-step generation](/en/guide/typescript/proto-enums) | Native | Native (esbuild) |
| Min Node.js version | 25.2.0 (for native `.ts` execution) | N/A (Bun runtime) | 18.0.0 |

## Docker

In Dockerfiles, use the appropriate `CMD` for your runtime:

```dockerfile
# Node.js 25+ (native TypeScript for your own .ts files)
CMD ["node", "src/index.ts"]

# Bun
CMD ["bun", "src/index.ts"]

# tsx (Node.js 18+)
CMD ["npx", "tsx", "src/index.ts"]
```

## Related

- [TypeScript Overview](/en/guide/typescript) -- back to overview
- [Erasable Syntax](/en/guide/typescript/erasable-syntax) -- constraints for native TypeScript execution
- [Proto Enums](/en/guide/typescript/proto-enums) -- workaround for proto enum generation
- [@connectum/core](/en/packages/core) -- Package Guide
