[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / shared

# shared

Shared utilities for server and client OTel interceptors

Contains common helper functions used by both createOtelInterceptor()
and createOtelClientInterceptor().

## Interfaces

- [BaseAttributeParams](interfaces/BaseAttributeParams.md)
- [StreamOptions](interfaces/StreamOptions.md)

## Type Aliases

- [HookFailureReporter](type-aliases/HookFailureReporter.md)
- [StreamOutcome](type-aliases/StreamOutcome.md)

## Variables

- [NON\_RECORDING\_SPAN](variables/NON_RECORDING_SPAN.md)

## Functions

- [applyAttributeFilter](functions/applyAttributeFilter.md)
- [buildBaseAttributes](functions/buildBaseAttributes.md)
- [buildErrorAttributes](functions/buildErrorAttributes.md)
- [buildSuccessAttributes](functions/buildSuccessAttributes.md)
- [createHookFailureReporter](functions/createHookFailureReporter.md)
- [detectConnectumTransport](functions/detectConnectumTransport.md)
- [estimateMessageSize](functions/estimateMessageSize.md)
- [isServerErrorStatus](functions/isServerErrorStatus.md)
- [markSpanFailed](functions/markSpanFailed.md)
- [scopeAsyncIterable](functions/scopeAsyncIterable.md)
- [shouldInstrument](functions/shouldInstrument.md)
- [wrapAsyncIterable](functions/wrapAsyncIterable.md)
