# Cross-Transport Parity Invariant

Connectum exposes two transports for ConnectRPC services:

- the **HTTP/2 transport** — the production wire protocol;
- the **in-process transport** — `createLocalTransport(server)` /
  `Server.client(ServiceDesc)`, which delivers requests directly into the
  registered route handlers without serialization or a socket.

The framework guarantees a **Behavioural Parity** invariant between them:

> For every observable behaviour of a ConnectRPC service, the in-process
> transport produces results that structurally match the HTTP/2 transport.
> Observable behaviours include response payloads, response headers and
> trailers, `ConnectError` codes / messages / metadata / `details`, the order
> of streaming messages, cancellation propagation, OpenTelemetry spans
> (modulo the `connectum.transport` attribute), and metric label sets
> (modulo the `transport` label).

This invariant is **release-blocking**: any PR that breaks it must either be
revised or accompanied by a documented carve-out in the spec.

## How the invariant is enforced

1. **`transportParityTest()` driver** (`@connectum/testing/parity`) runs every
   scenario twice — once over `createGrpcTransport({ baseUrl })` and once over
   `createLocalTransport(server)` — and performs a structural diff on the
   normalized result (response, headers, error, OTEL spans, metrics).
2. **Parity suite** — aggregated by `scripts/parity-suite.sh`, covering
   interceptors, validation, authorization, streaming, error mapping,
   coexistence, and OTEL.
3. **`parity-gate` CI job** (`.github/workflows/parity-gate.yml`) runs the
   suite on every pull request and every push to `main`.

## When you MUST add a parity scenario

Any change that touches **observable RPC behaviour** must add (or extend) a
`transportParityTest()` scenario in the appropriate file under
`packages/testing/tests/parity/` (or `packages/otel/tests/parity/` for
observability). This includes, but is not limited to:

- a new interceptor in `@connectum/interceptors`;
- a new authentication or authorization rule in `@connectum/auth`
  (programmatic or proto-declared);
- a new validation rule wired through `protovalidate` / `buf.validate`;
- a new OpenTelemetry instrument, attribute, or span event in
  `@connectum/otel`;
- any change to `ConnectError` mapping in `@connectum/core` or interceptors;
- any change to header / trailer propagation;
- any change to streaming semantics (ordering, cancellation, back-pressure
  surfaces).

If the change is purely transport-local — for example, an HTTP-only header
that has no in-process analogue — document the carve-out in the parity test
file as a code comment **and** in the spec.

## When parity does not apply

A small set of behaviours are explicitly transport-specific and are
**not** asserted by the parity driver:

- Network-level concerns: TLS, HTTP/2 framing, TCP keepalive, `:authority`
  pseudo-header, real `req.url` host/port.
- Wire-format concerns: gzip/identity content-encoding negotiation, message
  framing on the wire.
- The synthetic origin `https://in-memory/<service>` that the in-process
  transport injects for interceptors that read `req.url`.
- The `connectum.transport` span attribute and the `transport` metric label,
  which differ by design and are stripped before structural diff.

## Pull request checklist

Every PR that touches a service-observable surface must:

- [ ] add or extend a `transportParityTest()` scenario covering the change, **or**
- [ ] explicitly mark the change as `parity: N/A` in the PR description and
      justify why.

The `parity-gate` CI job will block merge on any structural diff.

## References

- [In-process transport guide](../guide/production/in-process-transport.md)
- [Parity coverage report](./parity-coverage.md)
- Internal design notes: see ADR for in-process transport (registry-based local invoke)
