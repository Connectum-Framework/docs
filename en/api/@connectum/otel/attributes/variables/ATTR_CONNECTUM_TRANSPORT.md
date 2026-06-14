[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [attributes](../index.md) / ATTR\_CONNECTUM\_TRANSPORT

# Variable: ATTR\_CONNECTUM\_TRANSPORT

> `const` **ATTR\_CONNECTUM\_TRANSPORT**: `"connectum.transport"` = `"connectum.transport"`

Defined in: [packages/otel/src/attributes.ts:43](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/otel/src/attributes.ts#L43)

Connectum-specific span attribute that distinguishes RPC observations
carried by the in-process router transport from those carried by HTTP/2.

Values:
  - `"in-process"` — the call traversed `createLocalTransport`
  - `"http"`       — the call traversed `createGrpcTransport` /
                     `createConnectTransport` (the network path)

Parity tests strip this attribute before structural diffing so that the
remaining shape (spans, events, metric instruments) is invariant across
transports.

## See

ATTR_CONNECTUM_TRANSPORT_METRIC for the metric-label counterpart
