---
title: Shutdown Behavior Changes
description: From 1.3.0, shutdown hooks run to completion when one fails, and stop() and signals during start() are honoured.
docType: migration
---

# Shutdown Behavior Changes

> Applies to 1.3.0.

## Does this apply to you?

Check the rows that match your code. A service that starts, serves and stops without any of these needs no change.

| If you... | Read |
|---|---|
| read `GRACEFUL_SHUTDOWN_TIMEOUT_MS` with `parseEnvConfig()` and set it empty or fractional | [Environment value checks](#env-checks) |
| rely on a failing shutdown hook to skip its dependents, or on `stop()` rejecting before the other hooks finish | [Hooks run to completion](#hooks-complete) |
| call `onShutdown()` with a string where the array of dependencies belongs | [`onShutdown()` argument checks](#onshutdown-arguments) |
| call `stop()` or send `SIGTERM` while `start()` is still running | [Stop and signals during startup](#stop-during-start) |

## Environment value checks {#env-checks}

`GRACEFUL_SHUTDOWN_TIMEOUT_MS` is now a whole number from 0 to 300000, like `PORT` is a whole number from 1 to 65535. An empty or whitespace-only value used to parse to `0`, which switched connection draining off; a fractional value such as `1.5` used to pass and then make `createServer()` throw. Both are now rejected by `parseEnvConfig()` and `safeParseEnvConfig()` with an issue on `GRACEFUL_SHUTDOWN_TIMEOUT_MS`.

**Required change:** remove `GRACEFUL_SHUTDOWN_TIMEOUT_MS=` lines with an empty value from compose files and manifests (leave the variable out to get the default of 30000), and give a whole number of milliseconds otherwise.

## Hooks run to completion {#hooks-complete}

Until 1.3.0, the first failing shutdown hook made `stop()` reject at once. Independent hooks that were still running were not awaited, and `stop` was emitted while they ran. A process that exited on the rejected `stop()` cut them off. Hooks that depended on the failed one never ran.

From 1.3.0 every hook runs and `stop()` waits for all of them. A hook that depends on a failed hook runs once the failed one has finished. `stop()` rejects with the failure itself when one hook failed, or with an `AggregateError` of all failures in registration order.

**Required change:** if a dependent hook assumed that its dependency had succeeded, make it check the state it needs. Code that reads the rejection of `stop()` as a single error should handle an `AggregateError` through its `errors` property.

## `onShutdown()` argument checks {#onshutdown-arguments}

`onShutdown()` now throws a `TypeError` that starts with `onShutdown(` for a call that matches none of its three forms. A string passed where the array of dependencies belongs, for example `onShutdown('x', 'db', fn)`, used to be split into single characters, so `x` ran without waiting for `db`.

**Required change:** pass an array: `onShutdown('x', ['db'], fn)`. A dependency on a name that nothing registers is still accepted.

## Stop and signals during startup {#stop-during-start}

Until 1.3.0, `stop()` called while `start()` was in progress rejected, and the server then finished starting and ran until it was killed. With `autoShutdown`, the signal handlers were installed after the port was bound, so a `SIGTERM` during a slow startup ended the process with exit code 143 and no hooks.

From 1.3.0, `stop()` during startup waits for the start to settle and then stops the server, and the signal handlers are installed when `start()` begins. If the start fails, the pending `stop()` resolves.

**Required change:** none for most services. If your own signal handler called `stop()` and handled its rejection during startup, the call now succeeds. A `start()` that never settles also keeps a pending stop waiting, so give a startup step that can hang its own timeout; a repeated signal still ends the process, because the first signal during the start releases the framework's handlers.

See [Graceful Shutdown](/en/guide/server/graceful-shutdown) for the full shutdown sequence.

## Verify the upgrade

Run your test suite with a test that registers two independent shutdown hooks, makes the first one throw, stops the server, and asserts that the second hook ran to completion before `stop()` rejected.
