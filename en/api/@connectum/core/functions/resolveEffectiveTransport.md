[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / resolveEffectiveTransport

# Function: resolveEffectiveTransport()

> **resolveEffectiveTransport**(`options`): [`EffectiveTransport`](../type-aliases/EffectiveTransport.md)

Defined in: [packages/core/src/TransportValidation.ts:67](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/TransportValidation.ts#L67)

Resolve the effective transport from the server's TLS and `allowHTTP1`
configuration. `allowHTTP1` defaults to `true` (matching TransportManager).

## Parameters

### options

#### allowHTTP1?

`boolean`

#### hasTls

`boolean`

## Returns

[`EffectiveTransport`](../type-aliases/EffectiveTransport.md)
