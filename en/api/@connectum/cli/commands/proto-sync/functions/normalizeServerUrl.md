[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / normalizeServerUrl

# Function: normalizeServerUrl()

> **normalizeServerUrl**(`from`): `string`

Defined in: [commands/proto-sync.ts:57](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L57)

Turn the `--from` value into the URL that reflection requests are sent to.

An address starting with `http://` or `https://` (any letter case) is returned exactly as
typed. An address that carries any other `<scheme>://` is refused, because the command
speaks HTTP/2 over `http` and `https` only and passing it on would end in a resolver error
naming the wrong host. Every other address is a bare `host:port` and gets `http://` in
front of it, whatever letters its host name starts with (`httpbin.local:5000` included).

## Parameters

### from

`string`

Raw `--from` value

## Returns

`string`

URL for the reflection client

## Throws

Error naming the scheme and the accepted forms when the address carries a non-HTTP scheme
