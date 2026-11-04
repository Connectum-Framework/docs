[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / withTelemetry

# Function: withTelemetry()

> **withTelemetry**\<`T`\>(`options`, `body`): `Promise`\<`T`\>

Defined in: [testing/src/telemetry.ts:134](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/telemetry.ts#L134)

Run `body` with a fresh span collector and a fresh metric collector
registered as the OpenTelemetry providers, then restore a clean state.
Any number of scenarios may follow one another in one process and each sees
only its own telemetry.

The requirement that `OTEL_TRACES_EXPORTER` and `OTEL_METRICS_EXPORTER` be
`none` while the scenario runs stays with the caller: with another exporter
`@connectum/otel` records into providers of its own, never into the
registered ones. Context propagation across a client and a server span needs
a context manager registered by the caller as well.

## Type Parameters

### T

`T`

## Parameters

### options

[`TelemetryOptions`](../interfaces/TelemetryOptions.md)

The `shutdownProvider` of `@connectum/otel`

### body

(`telemetry`) => `Promise`\<`T`\>

The scenario; receives the collectors

## Returns

`Promise`\<`T`\>

What `body` returned

## Example

```typescript
import { shutdownProvider } from "@connectum/otel";
import { withTelemetry } from "@connectum/testing";

const names = await withTelemetry({ shutdownProvider }, async ({ spans }) => {
    await client.sayHello({ name: "world" });
    return spans.flush().map((s) => s.name);
});
```

## Throws

TypeError when `options.shutdownProvider` is not a function
