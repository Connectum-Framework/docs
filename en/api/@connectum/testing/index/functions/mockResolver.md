[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / mockResolver

# Function: mockResolver()

> **mockResolver**(`mocks`): `RemoteResolver`

Defined in: [testing/src/mockResolver.ts:54](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/mockResolver.ts#L54)

Build a RemoteResolver that serves the given mocks in-process. Returns
`null` for any service not in the mock set (so it composes with real
resolvers via `mapResolver`-style fallbacks).

## Parameters

### mocks

readonly [`MockService`](../interfaces/MockService.md)[]

## Returns

`RemoteResolver`
