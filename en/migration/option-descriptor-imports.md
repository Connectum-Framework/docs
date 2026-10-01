---
title: Option Descriptors from the Packages
description: From 1.3.0, import the auth and events option descriptors from @connectum/auth and @connectum/events instead of generating local copies.
docType: migration
---

# Option Descriptors from the Packages

> Applies to 1.3.0. Optional: projects that keep generating their own copies keep working.

## Does this apply to you?

Only if your project generates code for Connectum's own option protos — its `gen/`
directory holds `connectum/auth/v1/options_pb.ts` or `connectum/events/v1/options_pb.ts`.
That is the case for projects created with `connectum init --auth` or `--events` before
1.3.0, and for projects that copied `connectum/events/v1/options.proto` into their proto
tree.

Nothing breaks if you do nothing: Protobuf-ES matches an extension by the extended
message's type name and the field number, so a local copy of the descriptors reads the
same options as the package's. Adopting the change removes the duplicate generated code
and makes your generated files use the very descriptor objects that `@connectum/auth` and
`@connectum/events` use.

## What changed

- `@connectum/auth` exports `@connectum/auth/gen/connectum/auth/v1/options_pb.js`, and
  `@connectum/events` exports `@connectum/events/gen/connectum/events/v1/options_pb.js`.
  Each is the module the package itself uses at runtime.
- `connectum init --auth` / `--events` generates a `buf.gen.yaml` that imports from those
  subpaths and no longer generates the option protos, and sets every `@connectum/*`
  dependency to one range of `^1.3.0` or higher.

## Required changes

1. Move every `@connectum/*` dependency to one 1.3.0-or-later range, and make sure
   `@bufbuild/protoc-gen-es` is 2.15.0 or later (`map_imports` first ships there; the
   scaffold declares `^2.16.0`). Keep a single `@bufbuild/protobuf` version.
2. In `buf.gen.yaml`, generate from your own protos only, and map the option-proto
   imports to the packages. Pass `map_imports` to `protoc-gen-es` only — Connectum's
   catalog plugin rejects options it does not know:

   ```yaml
   version: v2
   clean: true
   inputs:
     - directory: proto
       # only if your proto tree holds a copy of the events option proto
       exclude_paths:
         - proto/connectum/events/v1
   plugins:
     - local: protoc-gen-es
       out: gen
       opt:
         - target=ts
         - import_extension=.ts
         - erasable_syntax=true
         - map_imports=connectum/auth/v1/:@connectum/auth/gen     # with auth
         - map_imports=connectum/events/v1/:@connectum/events/gen # with events
   ```

   Keep a single input. With auth, `buf.yaml` still lists
   `node_modules/@connectum/auth/proto` as a module, so buf can compile the imports;
   pinning the input to `proto` stops it from generating that module. One input per
   module would run each plugin once per module.

   If you also generate the service catalog, keep `strategy: all` on
   `protoc-gen-connectum-catalog`, as `connectum init` writes it. A single input does not
   change buf's default `directory` strategy, which would run the plugin once per
   directory, and every run writes the same `catalog.gen.ts`:

   ```yaml
     - local: protoc-gen-connectum-catalog
       strategy: all
       out: gen
       opt:
         - target=ts
         - import_extension=.ts
   ```
3. Run `buf generate` (with `clean: true` it removes the old `gen/connectum/` files),
   then `typecheck`. If your own code imported from `#gen/connectum/auth/v1/options_pb.ts`
   or `#gen/connectum/events/v1/options_pb.ts`, import the same names from
   `@connectum/auth/proto` (auth) or from the package subpaths above instead.

## Verify

- `gen/` contains no `connectum/auth/v1/options_pb.ts` or `connectum/events/v1/options_pb.ts`.
- The generated files that use the options import
  `@connectum/auth/gen/connectum/auth/v1/options_pb.js` /
  `@connectum/events/gen/connectum/events/v1/options_pb.js`.
- `typecheck` and your tests pass.
