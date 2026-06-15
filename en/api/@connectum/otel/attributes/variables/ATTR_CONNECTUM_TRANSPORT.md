[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [attributes](../index.md) / ATTR\_CONNECTUM\_TRANSPORT

# Variable: ATTR\_CONNECTUM\_TRANSPORT

> `const` **ATTR\_CONNECTUM\_TRANSPORT**: `"connectum.transport"` = `"connectum.transport"`

Defined in: [packages/otel/src/attributes.ts:43](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/otel/src/attributes.ts#L43)

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
