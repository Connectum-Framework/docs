[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / normalizeServerUrl

# Function: normalizeServerUrl()

> **normalizeServerUrl**(`from`): `string`

Defined in: [commands/proto-sync.ts:64](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L64)

Turn the `--from` value into the URL that reflection requests are sent to.

An address starting with `http://` or `https://` (any letter case) is returned exactly as
typed. An address that carries any other `<scheme>://` is refused, because the command
speaks HTTP/2 over `http` and `https` only and passing it on would end in a resolver error
naming the wrong host. Every other address is a bare `host:port` and gets `http://` in
front of it, whatever letters its host name starts with (`httpbin.local:5000` included).

The result must parse as a URL; an empty address and one that does not (`local host:5000`) are
refused here, naming the value, instead of surfacing as `Invalid URL` from deep inside the client.

## Parameters

### from

`string`

Raw `--from` value

## Returns

`string`

URL for the reflection client

## Throws

CliError naming the scheme and the accepted forms when the address carries a non-HTTP
  scheme, and naming the value when the address is empty or not a URL
