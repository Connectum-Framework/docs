[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / createHookFailureReporter

# Function: createHookFailureReporter()

> **createHookFailureReporter**(`owner`): [`HookFailureReporter`](../type-aliases/HookFailureReporter.md)

Defined in: [shared.ts:379](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L379)

Creates the reporter an interceptor uses when one of its user callbacks (`filter`,
`attributeFilter`) throws.

The callback is the application's code on the path of every RPC: its bug must not
fail the call, so the interceptor goes on and reports the error through the
OpenTelemetry diagnostics channel (`diag`), which has no output until the
application or `initProvider()` registers a logger. A callback that is broken for
every call would otherwise flood the log, so each callback is reported once per
owner. The reporter never throws.

## Parameters

### owner

`string`

What the reporter belongs to, named in the message ("the server interceptor")

## Returns

[`HookFailureReporter`](../type-aliases/HookFailureReporter.md)

The reporter
