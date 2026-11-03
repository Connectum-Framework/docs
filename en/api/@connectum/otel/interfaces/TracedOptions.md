[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / TracedOptions

# Interface: TracedOptions

Defined in: [types.ts:111](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L111)

Options for traced() function wrapper

## Properties

### argsFilter?

> `optional` **argsFilter?**: [`ArgsFilter`](../type-aliases/ArgsFilter.md)

Defined in: [types.ts:129](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L129)

Additional transform/masking for recorded args.
Called after whitelist filtering.

***

### attributes?

> `optional` **attributes?**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [types.ts:134](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L134)

Custom attributes to add to every span

***

### name?

> `optional` **name?**: `string`

Defined in: [types.ts:115](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L115)

Span name. Defaults to fn.name or "anonymous"

***

### recordArgs?

> `optional` **recordArgs?**: `boolean` \| `string`[]

Defined in: [types.ts:123](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L123)

Record function arguments as span attributes.
- `false` (default): no args recorded
- `true`: all args recorded
- `string[]`: whitelist of zero-based argument indices encoded as strings
