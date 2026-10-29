# Validation example

This example uses published `@connectum/core` and `@connectum/interceptors` 1.2.0.
The Validation page runs protovalidate and this handler locally in the browser.
This directory supplies the real HTTP RPC counterpart, using the same proto.

From this directory, with Node.js >=22.13 and pnpm 11:

```bash
pnpm install --frozen-lockfile
pnpm generate
pnpm typecheck
pnpm test
```

`buf.lock` pins the validation annotations. Generated descriptors retain both
`string.min_len` and `int32.gt`. The test starts a server on an ephemeral loopback
port and compares four real Connect requests with `../recording.json`:

| SKU | Quantity | Result | Handler calls |
| --- | --- | --- | --- |
| `A-1` | 2 | Stock from the example map | 1 |
| `A-1` | 0 | `InvalidArgument` | 0 |
| Empty | 2 | `InvalidArgument` | 0 |
| `UNKNOWN` | 2 | `NotFound` | 1 |

The recording is test evidence, not the live form's data source. Guide tests
compare the browser evaluator with its codes, responses and handler boundaries.
The captured violations come from protovalidate, not handwritten rule checks.
Source hashes reject stale captures. After changing this example, inspect new
results before accepting them:

```bash
pnpm record
pnpm test
```

The site commits a small browser descriptor under `../gen/`. From the repository
root, `pnpm validation:generate` reproduces it using the official generator with
package-mapped validation imports. CI rejects descriptor drift. An ordinary docs
build needs only the root dependencies, not this directory's install or ignored
`gen/` output.

The inventory map is fixture data. The handler looks up the SKU; quantity is
checked by proto validation. No production database or browser-hosted RPC server
is implied.
