# Validation showcase example

This example supplies the recorded results shown on the Validation overview.
It uses the published `@connectum/core` and `@connectum/interceptors` 1.2.0
packages. The browser displays the recording; it does not start this server.

From this directory, with Node.js >=22.13 and pnpm 11:

```bash
pnpm install --frozen-lockfile
pnpm generate
pnpm typecheck
pnpm test
```

`buf.lock` pins the validation annotation dependency. Generation retains its
descriptors so the validation interceptor can read the `min_len` constraint.

The test starts a server on a loopback ephemeral port and sends three real
Connect requests over HTTP/1.1. It compares response codes, messages and handler
invocations with `../recording.json`:

| Request | Result | Handler calls |
| --- | --- | --- |
| Empty SKU | `InvalidArgument` from validation | 0 |
| `A-1` | Stock from the example map | 1 |
| `UNKNOWN` | `NotFound` from the handler | 1 |

The source hashes also guard the displayed recording against changes to the
contract, handler, server, capture logic and locked dependencies. After an
intentional example change, inspect the new results before updating the recording:

```bash
pnpm record
pnpm test
```

The record includes the decoded response or `ConnectError` fields used by the
showcase, not a byte-for-byte dump of HTTP traffic. The inventory map is fixture
data, not a database adapter. No resilience policy or network service is simulated
by the browser's path replay.
