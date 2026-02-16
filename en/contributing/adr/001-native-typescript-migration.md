# ADR-001: Compile-Before-Publish TypeScript Strategy

## Status

**Accepted** -- 2026-02-16 (supersedes original ADR-001 from 2025-12-22)

## Context

### Original Decision

The original ADR-001 (2025-12-22) chose to publish `@connectum/*` packages as raw `.ts` source files to npm, relying on Node.js 25.2.0+ stable type stripping at runtime. The rationale was zero build step, instant startup, and simplified CI/CD.

After real-world feedback and deeper analysis, this decision has been **revised**.

### Node.js Maintainer Feedback

A Node.js core maintainer provided the following critical feedback on the "publish .ts source" approach:

1. **Node.js actively blocks type stripping in `node_modules`** -- this is an intentional design decision, not a temporary limitation. See the [official documentation](https://nodejs.org/api/typescript.html#type-stripping-in-dependencies).

2. **TypeScript is not backward-compatible** -- TypeScript regularly introduces breaking changes in minor versions. Real-world examples include `noble/hashes` and `uint8array` breakage, as well as legacy decorators vs. TC39 Stage 3 decorators incompatibilities.

3. **Each package must control its own TypeScript version** -- a package should compile with the TypeScript version it was tested against and publish the resulting JavaScript. Forcing consumers to strip types at runtime couples them to the publisher's TypeScript version.

4. **JavaScript is permanently backward-compatible** -- once valid JS is published, it works forever. TypeScript source does not have this guarantee.

5. **Official position** -- Node.js documentation explicitly states that type stripping should not be used for dependencies in `node_modules`.

6. **Practical breakage patterns** -- decorator semantics, enum compilation changes, and import resolution differences across TypeScript versions create silent failures that are difficult to diagnose.

### Loader Propagation Issues

The raw `.ts` publishing approach required consumers to register a custom loader (`@connectum/core/register`) or use `--import` flags. This created several problems:

- **Worker threads** do not inherit `--import` hooks
- **`fork()` / `spawn()`** do not propagate loader configuration
- **APM instrumentation tools** (OpenTelemetry, Datadog, New Relic) may not propagate hooks correctly
- **Test runners and build tools** may strip or ignore custom loaders

These issues made the raw `.ts` approach unreliable in production environments with complex process hierarchies.

### Industry-Standard Practice

Compile-before-publish is the established pattern used by virtually all major TypeScript packages in the ecosystem. Frameworks and libraries such as tRPC, Fastify, Effect, Drizzle ORM, and Hono all develop in TypeScript but publish compiled `.js` + `.d.ts` + source maps. Common tooling includes:

- **tsup** (esbuild-powered) or **unbuild** (rollup-powered) for fast compilation
- **ESM** as the primary output format
- **`declarationMap: true`** for IDE jump-to-source navigation
- **Turborepo** or **Nx** for monorepo build orchestration

This pattern is well-proven at scale across monorepos with dozens of packages.

## Decision

**Compile-before-publish with tsup**: develop in `.ts`, publish `.js` + `.d.ts` + source maps to npm.

### Build Pipeline

| Tool | Purpose |
|------|---------|
| **tsup** | Compile TS to JS (esbuild under the hood) |
| **tsc** | Type checking only (`--noEmit`) |
| **Turborepo** | Orchestrate build tasks across monorepo |

Output characteristics:
- **ESM only** (`type: "module"`)
- **Declaration files** (`.d.ts`) for consumer type checking
- **Declaration maps** (`declarationMap: true`) for IDE jump-to-source
- **Source maps** (`.js.map`) for debugging
- **No minification** -- framework code should be readable

### tsup Configuration

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
})
```

### Package.json Template

```json
{
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "node --watch src/index.ts",
    "typecheck": "tsc --noEmit",
    "test": "node --test tests/**/*.test.ts"
  }
}
```

### TypeScript Configuration

The `tsconfig.json` remains largely unchanged from the original ADR:

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
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### What Is Preserved from the Original ADR

The following conventions remain unchanged:

- **`erasableSyntaxOnly: true`** -- no `enum`, no `namespace` with runtime code, no parameter properties
- **`verbatimModuleSyntax: true`** -- explicit `import type` required
- **`.ts` extensions in import paths** -- `rewriteRelativeImportExtensions` rewrites them to `.js` during build
- **`node src/index.ts`** for local development -- type stripping works outside `node_modules`
- **`node --watch src/index.ts`** for hot reload during development
- **`tsc --noEmit`** for type checking
- **Node.js >= 25.2.0** for the development environment
- All syntax restrictions (no enum, no namespace, no parameter properties, no decorators, explicit `import type`, `package.json#imports` for path aliases)

### What Changes

| Aspect | Before (Original ADR-001) | After (This ADR) |
|--------|---------------------------|-------------------|
| npm artifact | `src/*.ts` (raw source) | `dist/*.js` + `dist/*.d.ts` + `dist/*.js.map` |
| package.json exports | `./src/index.ts` | `./dist/index.js` |
| Build step | None | `tsup` before publish |
| `@connectum/core/register` | Required for consumers | **DEPRECATED** (no longer needed) |
| Consumer Node.js requirement | `>=25.2.0` | `>=18.0.0` (any modern Node.js) |
| Consumer TypeScript coupling | Must match publisher's TS version | Decoupled via `.d.ts` |
| Development Node.js requirement | `>=25.2.0` | `>=25.2.0` (unchanged) |

## Consequences

### Positive

1. **Broad Consumer Compatibility** -- published JavaScript works on any Node.js >=18.0.0. Consumers are no longer forced to use Node.js 25.2.0+ at runtime.

2. **No Loader Issues** -- compiled JavaScript requires no custom loaders, hooks, or `--import` flags. Worker threads, `fork()`, and APM tools work without special configuration.

3. **TypeScript Version Decoupling** -- the framework controls which TypeScript version it compiles with. Consumers receive stable `.d.ts` declarations that work with any compatible TypeScript version.

4. **Ecosystem Standard** -- compile-before-publish is the established pattern used by virtually all major TypeScript packages (tRPC, Fastify, Effect, Drizzle ORM, Hono, etc.). This reduces surprise for consumers.

5. **Permanent Backward Compatibility** -- published JavaScript does not break across TypeScript or Node.js upgrades. Once published, it works forever.

6. **IDE Experience Preserved** -- `declarationMap: true` enables jump-to-source navigation in IDEs, providing the same developer experience as raw `.ts` source.

7. **Development Workflow Unchanged** -- developers still write `.ts`, run `node src/index.ts` locally, and use `node --watch` for hot reload. The build step only runs before publish.

### Negative

1. **Added Build Step** -- `tsup` must run before publishing. This adds ~2-5 seconds per package to the CI/CD pipeline. Mitigated by Turborepo caching and parallel builds.

2. **`dist/` Directory** -- each package now has a `dist/` folder that must be gitignored and managed. Mitigated by `.gitignore` and `files` field in `package.json`.

3. **Build Dependency** -- tsup (and transitively esbuild) is added as a dev dependency. Mitigated by the fact that tsup is a well-maintained, widely-used build tool with minimal dependencies.

4. **Source Not Directly Readable in `node_modules`** -- consumers see compiled JS in `node_modules` instead of TypeScript source. Mitigated by source maps and declaration maps for debugging and navigation.

### Risks

1. **tsup/esbuild compatibility** -- if tsup introduces a breaking change, it could affect the build pipeline. Mitigated by pinning versions and using Turborepo's deterministic builds.

2. **Declaration file accuracy** -- `.d.ts` generation can occasionally produce incorrect types for complex TypeScript patterns. Mitigated by `tsc --noEmit` type checking and integration tests.

## Migration Plan

### Phase 1: Add Build Tooling

- Add `tsup` as a dev dependency to each `@connectum/*` package
- Create `tsup.config.ts` in each package
- Add `build` script to each `package.json`
- Add `dist/` to `.gitignore`
- Update Turborepo pipeline to include `build` task

### Phase 2: Update Package Exports

- Change `package.json` exports from `./src/index.ts` to `./dist/index.js`
- Add `types` field pointing to `./dist/index.d.ts`
- Update `files` field to include only `dist`
- Add `declarationMap: true` to `tsconfig.json`

### Phase 3: Deprecate Register Hook

- Mark `@connectum/core/register` as deprecated with a console warning
- Update documentation to remove loader registration instructions
- Remove register entrypoint in the next major version

### Phase 4: Update CI/CD and Documentation

- Update GitHub Actions workflows to run `pnpm build` before publish
- Update Changesets publish workflow to include build step
- Update all documentation, guides, and examples
- Update `engines` field: keep `>=25.2.0` for development, document `>=18.0.0` for consumers

## Alternatives Considered

### Alternative 1: Keep Raw .ts Publishing (Original ADR-001)

**Rejected.** While appealing in theory (zero build step), this approach is explicitly blocked by Node.js in `node_modules`, couples consumers to a specific TypeScript version, and creates unreliable behavior with worker threads and process forking.

### Alternative 2: tsc Compilation

**Considered but not chosen.** Standard `tsc` compilation works but is significantly slower than tsup/esbuild for the compilation step. It also does not support bundling or tree-shaking if needed in the future. tsup provides a faster, more flexible build pipeline while still using `tsc` for type checking.

### Alternative 3: Dual ESM + CJS Publishing

**Deferred.** Publishing both ESM and CJS formats increases package size and complexity. Since Connectum targets modern Node.js environments, ESM-only is sufficient. CJS support can be added later via tsup's `format: ['esm', 'cjs']` if consumer demand justifies it.

### Alternative 4: SWC-based Compilation

**Considered but not chosen.** SWC is faster than esbuild for some workloads but has less mature `.d.ts` generation. tsup's esbuild backend is fast enough for Connectum's package sizes, and tsup's built-in dts support simplifies the pipeline.

### Alternative 5: Bun / Deno Runtime

**Rejected.** Both runtimes have native TypeScript support but would abandon the Node.js ecosystem and ConnectRPC compatibility. The Node.js ecosystem is a core requirement for Connectum.

## References

1. [Node.js -- Type Stripping in Dependencies](https://nodejs.org/api/typescript.html#type-stripping-in-dependencies) -- official documentation on why type stripping is blocked in `node_modules`
2. [Node.js TypeScript Documentation](https://nodejs.org/api/typescript.html) -- full TypeScript support documentation
3. [tsup Documentation](https://tsup.egoist.dev/) -- build tool used for compilation
4. [TypeScript 5.8 -- `rewriteRelativeImportExtensions`](https://www.typescriptlang.org/tsconfig#rewriteRelativeImportExtensions) -- compiler option for `.ts` to `.js` import rewriting
5. [Turborepo Documentation](https://turbo.build/repo/docs) -- monorepo build orchestration

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-22 | Claude | Original ADR: Native TypeScript (raw .ts publishing) |
| 2026-02-16 | Claude | Revised: Compile-before-publish with tsup (this version) |
