# ADR-009: Migration to Buf CLI v2 for Proto Generation

**Status:** Accepted - 2026-02-06

**Deciders:** Tech Lead, Platform Team

**Tags:** `protobuf`, `buf`, `code-generation`, `lint`, `breaking-changes`, `tooling`

---

## Context

### Prior State (before ADR-009)

The `@connectum/proto` package contained 15+ third-party proto files (googleapis, grpc health/reflection, buf validate, openapiv3) and used `protoc` for code generation. [Update: @connectum/proto removed, see ADR-003] The pipeline was:

```
proto/*.proto -> protoc + protoc-gen-es -> gen-ts/*.ts -> tsc -> gen/*.js
```

**Problems with this approach:**

1. **No version pinning for protoc**: System-wide `protoc v3.21.12` installed globally. Different developers and CI environments may have different versions, breaking reproducible builds.

2. **Two-stage generation process**: `protoc-gen-es` generates `.ts` files with `enum` (non-erasable syntax) that Node.js 25.2.0+ cannot execute directly. An intermediate `tsc` step is required to compile to `.js` (see [ADR-001](./001-native-typescript-migration.md)).

3. **No proto file linting**: No style checks, naming conventions, or best practices enforcement for `.proto` files.

4. **No breaking change detection**: Proto contract changes could silently break compatibility between services.

5. **No declarative configuration**: The `protoc:generate` command contained a long `find ... -exec protoc ...` string in package.json, hard to read and maintain.

6. **Vendor protos mixed with user protos**: No clear separation between third-party protos (google, grpc, buf, openapiv3) and project-owned proto files.

### Requirements

1. **Reproducible builds**: Identical results on any machine and in CI
2. **Proto quality**: Linting and style checking for proto files
3. **Backward compatibility**: Breaking change detection in proto contracts
4. **Simplicity**: Declarative configuration instead of imperative scripts
5. **Fallback**: Ability to revert to protoc if problems arise with buf

---

## Decision

**We adopt [Buf CLI v2](https://buf.build/docs/cli/) as the primary tool for proto code generation, linting, and breaking change detection, while keeping protoc as a fallback.**

### Configuration

#### buf.yaml (module and rules)

```yaml
version: v2
modules:
  - path: proto
lint:
  use:
    - STANDARD
  ignore:
    - proto/google
    - proto/grpc
    - proto/buf
    - proto/openapiv3
breaking:
  use:
    - FILE
  ignore:
    - proto/google
    - proto/grpc
    - proto/buf
    - proto/openapiv3
```

**Configuration rationale:**

- **STANDARD lint rules**: Balance between strictness and practicality. Includes naming conventions, package structure, import checks.
- **FILE level breaking detection**: Checks breaking changes at the file level (renaming, removing fields/services). Less strict than WIRE (allows renumbering reserved fields).
- **Vendor protos in ignore**: Third-party files (google, grpc, buf, openapiv3) excluded from lint and breaking checks -- we don't control their format.

#### buf.gen.yaml (code generation)

```yaml
version: v2
clean: true
inputs:
  - directory: proto
plugins:
  - local: protoc-gen-es
    out: gen-ts
    opt:
      - target=ts
      - import_extension=.js
    include_imports: true
```

**Configuration rationale:**

- **`clean: true`**: Automatically cleans the output directory before generation. Eliminates stale file issues.
- **`local: protoc-gen-es`**: Uses a locally installed plugin (via npm). Buf invokes it the same way as protoc, but with managed dependency resolution.
- **`include_imports: true`**: Generates code for imported proto files (google/protobuf, buf/validate, etc.).

### npm scripts

```json
{
  "scripts": {
    "buf:generate": "buf generate",
    "buf:lint": "buf lint",
    "buf:breaking": "buf breaking --against '../../.git#branch=main,subdir=packages/proto'",
    "protoc:generate": "mkdir -p gen-ts && find proto -name '*.proto' -exec pnpm exec protoc -I proto --es_out=gen-ts --es_opt=target=ts,import_extension=.js {} +",
    "build:proto": "pnpm run buf:generate && pnpm run build:proto:compile",
    "build:proto:protoc": "pnpm run protoc:generate && pnpm run build:proto:compile",
    "build:proto:compile": "tsc --project tsconfig.build.json",
    "clean": "rm -rf gen gen-ts"
  }
}
```

**Two generation paths:**

| Command | Tool | When to use |
|---------|------|-------------|
| `build:proto` | **Buf CLI** (primary) | Default path: `buf generate` + `tsc` |
| `build:proto:protoc` | **protoc** (fallback) | When Buf CLI has issues |

### Dependency Management

```json
{
  "devDependencies": {
    "@bufbuild/buf": "catalog:",
    "@bufbuild/protoc-gen-es": "catalog:",
    "typescript": "catalog:"
  }
}
```

- **`@bufbuild/buf`**: Buf CLI as npm devDependency. Version pinning via pnpm catalog. Reproducible builds without global installation.
- **`@bufbuild/protoc-gen-es`**: Plugin for generating ES-compatible TypeScript code from proto files.

---

## Consequences

### Positive

1. **Version pinning via npm** -- `@bufbuild/buf` is pinned in pnpm catalog. All developers and CI use the same version. Reproducible builds guaranteed.

2. **Built-in proto linting** -- STANDARD rules cover naming conventions, structure, and best practices. Proto errors caught before code generation. `buf lint` integrates into CI.

3. **Breaking change detection** -- `buf breaking --against '../../.git#branch=main,subdir=packages/proto'` compares against previous version in git. FILE level detection catches removal/renaming of fields, services, and methods.

4. **Simplified CI/CD** -- One tool for lint, breaking check, and generation. Declarative config (buf.yaml, buf.gen.yaml) instead of long shell commands. `clean: true` eliminates stale file issues.

5. **Declarative configuration** -- buf.yaml describes the module, lint rules, and breaking rules. buf.gen.yaml describes plugins and output. Easy to read, understand, and maintain.

6. **Automatic output cleanup** -- `clean: true` in buf.gen.yaml deletes gen-ts/ before each generation, eliminating orphaned files when protos are removed.

### Negative

1. **Additional devDependency (~50MB)** -- `@bufbuild/buf` adds ~50MB to node_modules. Increases `pnpm install` time. **Mitigation:** devDependency only, does not affect production bundle.

2. **tsc step still required** -- `protoc-gen-es` generates TypeScript with `enum` (non-erasable syntax). Node.js 25.2.0+ cannot execute enum directly. Two-step process remains: `buf generate` -> `tsc`. **Mitigation:** Awaiting native enum support in Node.js (see [ADR-001](./001-native-typescript-migration.md)).

3. **Two generation paths (complexity)** -- `build:proto` (Buf) and `build:proto:protoc` (protoc fallback) create two paths that must both be maintained. **Mitigation:** protoc fallback is for emergencies only. Primary path is buf.

4. **Buf ecosystem dependency** -- buf.yaml and buf.gen.yaml are Buf-specific formats. Reverting from Buf would require a reverse migration. **Mitigation:** protoc fallback is preserved; reverse migration is trivial.

---

## Alternatives Considered

### Alternative 1: Keep only protoc (status quo)

**Rating:** 3/10 -- **REJECTED**

**Pros:** No additional dependencies; simple and well-known tool; widely used in the industry.

**Cons:** No version pinning (system protoc); no proto linting; no breaking change detection; imperative configuration (long shell commands); no automatic output cleanup.

**Why rejected:** Lack of lint, breaking detection, and version pinning creates risks for proto contract quality and build reproducibility.

### Alternative 2: Full migration to Buf (no protoc fallback)

**Rating:** 7/10 -- **REJECTED**

**Pros:** Simpler maintenance (single path); no configuration duplication; fewer scripts in package.json.

**Cons:** No fallback if Buf CLI has issues; blocks work on critical Buf bugs; single-tool dependency.

**Why rejected:** For a production-grade framework, having a fallback is important. If Buf CLI breaks in a new version, protoc allows work to continue without blocking.

### Alternative 3: Buf BSR (Buf Schema Registry)

**Rating:** 4/10 -- **REJECTED**

**Pros:** Centralized proto storage; proto versioning via registry; dependency management for protos (like npm for JS); hosted documentation.

**Cons:** Over-engineering for vendor protos; requires Buf BSR account; network dependency during generation; additional setup and maintenance complexity; vendor protos (google, grpc) are already available locally.

**Why rejected:** The project uses vendor proto files that rarely change. BSR adds complexity without proportionate benefit. Worth reconsidering when shared proto between multiple projects is needed.

---

## Implementation

### Created Files

| File | Purpose |
|------|---------|
| `packages/proto/buf.yaml` | Module, lint, and breaking rules configuration |
| `packages/proto/buf.gen.yaml` | Code generation configuration |

### Updated Files

| File | Change |
|------|--------|
| `packages/proto/package.json` | Added `buf:*` scripts, `@bufbuild/buf` devDependency |
| `turbo.json` | Added `buf:lint` task |
| `.gitignore` | Added patterns for Buf CLI |

### Commands

> **Update (2026-02-12):** Commands below refer to the removed `@connectum/proto` package. Buf CLI is still used by other packages for lint and code generation. See [ADR-003](./003-package-decomposition.md) for removal details.

```bash
# [Historical: @connectum/proto commands]
# Primary path (Buf CLI)
pnpm --filter @connectum/proto build:proto

# Lint proto files
pnpm --filter @connectum/proto buf:lint

# Check breaking changes
pnpm --filter @connectum/proto buf:breaking

# Fallback (protoc)
pnpm --filter @connectum/proto build:proto:protoc

# Clean
pnpm --filter @connectum/proto clean
```

---

## References

1. **Buf CLI Documentation**
   - Official: https://buf.build/docs/cli/
   - buf.yaml v2: https://buf.build/docs/configuration/v2/buf-yaml/
   - buf.gen.yaml v2: https://buf.build/docs/configuration/v2/buf-gen-yaml/

2. **Buf Lint Rules**
   - STANDARD rules: https://buf.build/docs/lint/rules/
   - Style guide: https://buf.build/docs/best-practices/style-guide/

3. **Buf Breaking Rules**
   - FILE level: https://buf.build/docs/breaking/rules/
   - Categories: https://buf.build/docs/breaking/overview/

4. **Implementation Files** [Update: @connectum/proto removed, these files no longer exist]
   - buf.yaml: `packages/proto/buf.yaml`
   - buf.gen.yaml: `packages/proto/buf.gen.yaml`
   - package.json: `packages/proto/package.json`

5. **Related ADRs**
   - [ADR-001: Native TypeScript Migration](./001-native-typescript-migration.md) -- Enum workaround (tsc step)
   - [ADR-003: Package Decomposition](./003-package-decomposition.md) -- @connectum/proto package [Update: @connectum/proto removed, see ADR-003]

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-02-06 | Claude | Initial ADR -- Buf CLI v2 migration |

---

## Future Considerations

### Removing the tsc step (Node.js enum support)

When Node.js adds stable `enum` support (via `--experimental-transform-types` -> stable), it will be possible to:
1. Remove `tsconfig.build.json`
2. Use `gen-ts/` directly as `gen/`
3. Simplify `build:proto` to a single step: `buf generate`

### Buf BSR for shared protos

When multiple projects share common proto contracts:
1. Create shared protos in Buf BSR
2. Use `buf dep update` for dependency management
3. Version proto contracts via BSR

### Removing protoc fallback

After stable Buf CLI operation across several releases:
1. Remove `protoc:generate` and `build:proto:protoc` scripts
2. Simplify documentation
3. Keep only the single generation path

### CI/CD integration

1. `buf lint` in pre-commit hook or CI pipeline
2. `buf breaking` in CI for pull requests (breaking change protection)
3. Automatic code generation on `.proto` file changes
