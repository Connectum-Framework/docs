[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / TelemetryOptions

# Interface: TelemetryOptions

Defined in: [testing/src/telemetry.ts:22](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/telemetry.ts#L22)

How a scenario gets telemetry of its own.

## Properties

### shutdownProvider

> **shutdownProvider**: () => `Promise`\<`void`\>

Defined in: [testing/src/telemetry.ts:29](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/telemetry.ts#L29)

`shutdownProvider` from `@connectum/otel`. It is passed in rather than
imported so that `@connectum/testing` does not depend on
`@connectum/otel`, and so that the function that is reset is the one the
code under test uses.

#### Returns

`Promise`\<`void`\>
