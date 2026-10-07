[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / mockResolver

# Function: mockResolver()

> **mockResolver**(`mocks`): `RemoteResolver`

Defined in: [testing/src/mockResolver.ts:53](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockResolver.ts#L53)

Build a [RemoteResolver](../../../core/type-aliases/RemoteResolver.md) that serves the given mocks in-process. Returns
`null` for any service not in the mock set (so it composes with real
resolvers via `mapResolver`-style fallbacks).

## Parameters

### mocks

readonly [`MockService`](../interfaces/MockService.md)[]

## Returns

`RemoteResolver`
