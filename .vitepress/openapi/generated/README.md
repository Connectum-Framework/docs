# Browser reader

The public `@connectum/auth/proto` entry also exports a server interceptor and
loads Node-only context code. `pnpm openapi:reader` bundles the published
`src/proto/reader.ts` without changing its implementation. Protobuf remains an
external shared dependency. No Node primitive is mocked or polyfilled.

The package, bundler and source/bundle hashes are recorded in `provenance.json`.
Tests compare this reader with the public package API on the actual edited and
compiled method descriptors. Regenerate the bundle and re-run parity tests when
the pinned package changes; do not edit `auth-reader.mjs` manually.
