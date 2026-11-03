# Service builder

The page runs a browser bundle of the CLI's actual `transformBase` function. It does
not maintain a parallel set of scaffold templates. The checked-in base files come
from the examples tag pinned by that CLI revision; provenance records both commits.

## Refresh the snapshot

With framework and examples checkouts available:

```bash
CONNECTUM_FRAMEWORK_ROOT=/path/to/framework \
CONNECTUM_EXAMPLES_ROOT=/path/to/examples pnpm builder:update

CONNECTUM_FRAMEWORK_ROOT=/path/to/framework pnpm builder:test
```

Without a framework checkout, `builder:test` runs the standalone tests and explicitly
skips upstream parity. With one, it compares 480 combinations against the upstream
transform. The framework checkout's scaffold sources must be clean before updating.

The only browser adaptation folds `posix.dirname(EVENTS_OPTIONS_PROTO_PATH)` into its
computed literal. A changed expression stops the update instead of silently replacing
the generator with a browser-only implementation.

The public/private `SayHello` control is a post-scaffold edit. It replaces
`public: true` with `requires: {}`, updates the rejection assertion and adds an
authenticated gRPC test using temporary RSA keys and a loopback JWKS endpoint.
The download includes these tests and the policy explanation. `SayGoodbye` retains
the scaffold's default-deny policy until an explicit rule allows it. The CLI
command continues to describe the CLI's normal public sample.

The builder offers npm/pnpm for Node.js and only bun for Bun. Its diff baseline is
always the original Node.js/pnpm service, never the previous click. The preview
keeps all application code and configuration navigable, including unchanged files;
changed files show a diff with nearby context. Tests, Docker files and framework
option protos remain in the full ZIP, not the file list.
The file tree stays on the left, as on the original builder.
The base example's `author` is omitted from generated manifests: it does not identify
the author of a user's new service. Upstream parity allows this intentional removal.
The archive test uses `unzip` as an independent reader.

Syntax highlighting loads only when the builder mounts. It tokenizes the complete
before/after files separately, then maps tokens onto the compact diff; removed lines
therefore retain their original multiline comment/string context. Vue renders tokens
as text spans, not injected HTML, and clipboard output still comes from the plain diff.

The snapshot currently targets the upcoming 1.3 release. Review the registry version
and release status in the update script before publishing the builder as a released
feature. The page must not suggest that an unpublished CLI is already installable.
