[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / markSpanFailed

# Function: markSpanFailed()

> **markSpanFailed**(`span`, `error`, `side`): `Record`\<`string`, `string`\>

Defined in: [shared.ts:294](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L294)

Marks a span as failed by the error a call ended with: the failure itself (status and
exception, see `recordFailure`) and the error attributes of [buildErrorAttributes](buildErrorAttributes.md).
The span status becomes `ERROR` for every failure of a client span, and for a server span
only when [isServerErrorStatus](isServerErrorStatus.md) says so. It does not end the span. Never throws.

## Parameters

### span

[`Span`](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api._opentelemetry_api.Span.html)

The span of the call

### error

`unknown`

The error, exactly as caught

### side

`"server"` \| `"client"`

Which side of the call the span belongs to

## Returns

`Record`\<`string`, `string`\>

The error attributes, for the metric points of the same call
