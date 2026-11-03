[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / StreamOutcome

# Type Alias: StreamOutcome

> **StreamOutcome** = \{ `failed`: `false`; \} \| \{ `error`: `unknown`; `failed`: `true`; \}

Defined in: [shared.ts:96](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L96)

How a stream ended: `failed` is true for an error raised by the source, whatever its value.
