[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / detectConnectumTransport

# Function: detectConnectumTransport()

> **detectConnectumTransport**(`headers`): `"http"` \| `"in-process"`

Defined in: [packages/otel/src/shared.ts:187](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/otel/src/shared.ts#L187)

Connectum transport identifier observed from request headers.

`@connectum/core`'s `createLocalTransport` sets a synthetic request header
(`connectum-internal-transport: in-process`) on every outgoing call so that
the OTel interceptors can tag spans and metrics with the originating
transport without parsing the synthetic `https://in-memory/...` URL.

## Parameters

### headers

`Headers`

The request headers (Connect `req.header`)

## Returns

`"http"` \| `"in-process"`

`"in-process"` if the marker is present, `"http"` otherwise.
