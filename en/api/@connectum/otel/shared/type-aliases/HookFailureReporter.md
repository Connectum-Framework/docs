[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / HookFailureReporter

# Type Alias: HookFailureReporter

> **HookFailureReporter** = (`hook`, `error`) => `void`

Defined in: [shared.ts:363](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L363)

Reports the failure of a user callback; see [createHookFailureReporter](../functions/createHookFailureReporter.md).

## Parameters

### hook

`"filter"` \| `"attributeFilter"`

### error

`unknown`

## Returns

`void`
