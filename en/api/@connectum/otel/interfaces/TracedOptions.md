[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / TracedOptions

# Interface: TracedOptions

Defined in: [packages/otel/src/types.ts:104](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L104)

Options for traced() function wrapper

## Properties

### argsFilter?

> `optional` **argsFilter**: [`ArgsFilter`](../type-aliases/ArgsFilter.md)

Defined in: [packages/otel/src/types.ts:122](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L122)

Additional transform/masking for recorded args.
Called after whitelist filtering.

***

### attributes?

> `optional` **attributes**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [packages/otel/src/types.ts:127](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L127)

Custom attributes to add to every span

***

### name?

> `optional` **name**: `string`

Defined in: [packages/otel/src/types.ts:108](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L108)

Span name. Defaults to fn.name or "anonymous"

***

### recordArgs?

> `optional` **recordArgs**: `boolean` \| `string`[]

Defined in: [packages/otel/src/types.ts:116](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L116)

Record function arguments as span attributes.
- `false` (default): no args recorded
- `true`: all args recorded
- `string[]`: whitelist of argument names/indices
