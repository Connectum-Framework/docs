---
outline: deep
---

# TypeScript

Native TypeScript execution via type stripping on Node.js 25+. Packages compile to JS + DTS via tsup for any runtime (Node.js 18+, Bun, tsx).

## Quick Start

```bash
# Node.js 25+ -- run TypeScript directly
node src/index.ts

# Development with auto-reload
node --watch src/index.ts
```

No loaders, no compilation step, no `tsc` required to run your code. TypeScript is used for type checking only (`tsc --noEmit`).

## Key Concepts

| Constraint | Rule |
|------------|------|
| **No `enum`** | Use `const` objects with `as const` |
| **No `namespace`** | Only type-only namespaces allowed |
| **No parameter properties** | Use explicit property declarations |
| **Explicit `import type`** | `verbatimModuleSyntax: true` |
| **`.ts` extensions** | Relative imports use `.ts`; generated code uses `.js` |
| **`node:` prefix** | Required for Node.js built-in modules |

These constraints come from `erasableSyntaxOnly: true` -- TypeScript syntax must be removable by stripping types, leaving valid JavaScript.

## Learn More

- [Runtime Support](/en/guide/typescript/runtime-support) -- Node.js 25+, Bun, tsx, Docker, comparison table
- [Erasable Syntax](/en/guide/typescript/erasable-syntax) -- constraints, import rules, tsconfig.json
- [Proto Enums](/en/guide/typescript/proto-enums) -- two-step generation workaround for proto enums
- [Patterns & Workflow](/en/guide/typescript/patterns) -- named parameters, branded types, development workflow
- [@connectum/core](/en/packages/core) -- Package Guide
