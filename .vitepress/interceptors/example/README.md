# Interceptor composition example

The Interceptors page runs custom ConnectRPC interceptors through the public
Connect-ES in-memory router transport. This example runs the same interceptor and
handler source on a real Connectum 1.2.0 server.

From this directory, with Node.js >=22.13 and pnpm 11:

```bash
pnpm install --frozen-lockfile
pnpm generate
pnpm typecheck
pnpm test
```

The test sends six real HTTP RPCs: three compositions, each with a successful
handler and a handler that throws `NotFound`. It checks the exact log, client
header, response or error and handler count against `../recording.json`. Guide
tests compare that capture with fresh in-memory execution.

With `[audit, stockTag]`, audit's after-step sees the header stockTag added.
With `[stockTag, audit]`, audit's after-step runs before stockTag adds it, so it
sees `unset`; the caller still receives the header. With `[audit]`, nobody adds
the header. A rejected `next(req)` skips the after-steps in these implementations.
They do not catch the rejection or run cleanup; production cleanup belongs in
`finally`.

The inventory map is fixture data. Logs omit request bodies and credentials.
The sample demonstrates unary server-side wrappers, not response-stream
iteration, authentication policy or the built-in chain's complete behavior.
Custom wrappers are appended after the default error handling and validation.

After an intentional source change, inspect the new capture before accepting it:

```bash
pnpm record
pnpm test
```

The website never reads the capture to display a live result. Its static fallback
also comes from execution at build time. Source hashes reject stale HTTP evidence.
From the repository root, `pnpm interceptors:generate` reproduces the committed
browser descriptor. CI checks it for drift. Site builds need only root
dependencies; standalone `gen/` output and dependencies are not required.
