[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / defaultPropagateHeaders

# Variable: defaultPropagateHeaders

> `const` **defaultPropagateHeaders**: readonly `string`[]

Defined in: [packages/core/src/propagateHeaders.ts:33](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/propagateHeaders.ts#L33)

Recommended default allow-list: W3C trace-context headers only.

Trace headers let a downstream call continue the inbound trace even without
an OpenTelemetry SDK. When the `@connectum/otel` client interceptor is also
mounted in `outgoingInterceptors`, it overwrites `traceparent` with the
active span's context (so the OTel value wins — no conflicting double value).

`authorization` is intentionally excluded: forwarding credentials is a
deliberate, security-sensitive choice the caller must opt into explicitly.

The array is frozen: spread it to build your own list, as in the example
above. Adding to it in place would change the default for the whole process.
