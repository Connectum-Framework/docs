[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / parseTimeoutOption

# Function: parseTimeoutOption()

> **parseTimeoutOption**(`raw`): `number` \| `undefined`

Defined in: [commands/proto-sync.ts:124](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L124)

Parse the `--timeout` value. Anything but a plain positive integer (`0`, `-5`, `1.5`,
`abc`, `10s`) is refused rather than coerced, so a typo cannot silently become "no limit".

## Parameters

### raw

`string` \| `undefined`

## Returns

`number` \| `undefined`
