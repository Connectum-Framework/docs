[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / TraceAllOptions

# Interface: TraceAllOptions

Defined in: [packages/otel/src/types.ts:133](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L133)

Options for traceAll() Proxy-based object wrapper

## Properties

### argsFilter?

> `optional` **argsFilter**: [`MethodArgsFilter`](../type-aliases/MethodArgsFilter.md)

Defined in: [packages/otel/src/types.ts:157](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L157)

Transform/masking for recorded args -- has access to method name.

***

### exclude?

> `optional` **exclude**: `string`[]

Defined in: [packages/otel/src/types.ts:144](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L144)

Blacklist of method names to exclude from wrapping

***

### include?

> `optional` **include**: `string`[]

Defined in: [packages/otel/src/types.ts:141](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L141)

Whitelist of method names to wrap (if provided, only these are wrapped)

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [packages/otel/src/types.ts:138](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L138)

Prefix for span names: "${prefix}.${methodName}"
Defaults to constructor.name or "Object"

***

### recordArgs?

> `optional` **recordArgs**: `boolean` \| `string`[]

Defined in: [packages/otel/src/types.ts:152](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L152)

Record method arguments as span attributes.
- `false` (default): no args recorded
- `true`: all args recorded
- `string[]`: whitelist of argument names/indices
