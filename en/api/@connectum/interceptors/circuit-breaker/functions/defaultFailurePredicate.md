[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [circuit-breaker](../index.md) / defaultFailurePredicate

# Function: defaultFailurePredicate()

> **defaultFailurePredicate**(`error`): `boolean`

Defined in: [circuit-breaker.ts:37](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/interceptors/src/circuit-breaker.ts#L37)

Default circuit-failure classification.

A ConnectError counts as a failure only when its code is an infrastructure
code (Unknown, DeadlineExceeded, Internal, Unavailable, DataLoss,
ResourceExhausted). Any non-ConnectError thrown value counts as a failure:
unknown transport or runtime faults must still protect the upstream.

Exported so custom predicates can compose with it — it is also passed as
the second argument to [CircuitBreakerOptions.failurePredicate](../../interfaces/CircuitBreakerOptions.md#failurepredicate).

## Parameters

### error

`unknown`

## Returns

`boolean`
