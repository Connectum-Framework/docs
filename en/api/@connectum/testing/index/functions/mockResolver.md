[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / mockResolver

# Function: mockResolver()

> **mockResolver**(`mocks`): `RemoteResolver`

Defined in: [testing/src/mockResolver.ts:54](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockResolver.ts#L54)

Build a [RemoteResolver](../../../core/type-aliases/RemoteResolver.md) that serves the given mocks in-process. Returns
`null` for services outside the mock set. To fall back to another resolver,
wrap both resolvers in a caller-provided function; the server accepts one
resolver and does not compose them automatically.

## Parameters

### mocks

readonly [`MockService`](../interfaces/MockService.md)[]

## Returns

`RemoteResolver`
