[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / TraceAllOptions

# Interface: TraceAllOptions

Defined in: [types.ts:140](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L140)

Options for traceAll() Proxy-based object wrapper

## Properties

### argsFilter?

> `optional` **argsFilter?**: [`MethodArgsFilter`](../type-aliases/MethodArgsFilter.md)

Defined in: [types.ts:164](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L164)

Transform/masking for recorded args -- has access to method name.

***

### exclude?

> `optional` **exclude?**: `string`[]

Defined in: [types.ts:151](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L151)

Blacklist of method names to exclude from wrapping

***

### include?

> `optional` **include?**: `string`[]

Defined in: [types.ts:148](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L148)

Whitelist of method names to wrap (if provided, only these are wrapped)

***

### prefix?

> `optional` **prefix?**: `string`

Defined in: [types.ts:145](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L145)

Prefix for span names: "${prefix}.${methodName}"
Defaults to constructor.name or "Object"

***

### recordArgs?

> `optional` **recordArgs?**: `boolean` \| `string`[]

Defined in: [types.ts:159](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L159)

Record method arguments as span attributes.
- `false` (default): no args recorded
- `true`: all args recorded
- `string[]`: whitelist of zero-based argument indices encoded as strings
