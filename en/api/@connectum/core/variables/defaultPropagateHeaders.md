[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / defaultPropagateHeaders

# Variable: defaultPropagateHeaders

> `const` **defaultPropagateHeaders**: readonly `string`[]

Defined in: [packages/core/src/propagateHeaders.ts:30](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/propagateHeaders.ts#L30)

Recommended default allow-list: W3C trace-context headers only.

Trace headers let a downstream call continue the inbound trace even without
an OpenTelemetry SDK. When the `@connectum/otel` client interceptor is also
mounted in `outgoingInterceptors`, it overwrites `traceparent` with the
active span's context (so the OTel value wins — no conflicting double value).

`authorization` is intentionally excluded: forwarding credentials is a
deliberate, security-sensitive choice the caller must opt into explicitly.
