[Connectum API Reference](../../../index.md) / [@connectum/events-amqp](../index.md) / isAutoRetriablePublishError

# Function: isAutoRetriablePublishError()

> **isAutoRetriablePublishError**(`err`, `options?`): `boolean`

Defined in: [packages/events-amqp/src/AmqpAdapter.ts:180](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/AmqpAdapter.ts#L180)

The publish AUTO-RETRY boundary (#195): which publish failures the opt-in
`publishRetry` retries inline.

Deliberately NARROWER than the at-least-once REPUBLISH matrix in the error
taxonomy (`errors.ts`): a broker nack is republish-safe by policy but is an
explicit refusal — hammering it in a tight loop is not a retry strategy.
Connection-class outcomes (`AmqpConnectionError`: publish during recovery,
in-flight confirm lost to a drop) are retriable; a timeout
(`AmqpPublishTimeoutError`, state UNKNOWN) joins only via
`retryOnTimeout: true`. Deterministic outcomes (unroutable, serialization,
topology) never retry.

## Parameters

### err

`unknown`

### options?

#### retryOnTimeout?

`boolean`

## Returns

`boolean`
