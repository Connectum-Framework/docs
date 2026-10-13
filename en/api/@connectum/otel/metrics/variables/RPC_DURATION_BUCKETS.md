[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [metrics](../index.md) / RPC\_DURATION\_BUCKETS

# Variable: RPC\_DURATION\_BUCKETS

> `const` **RPC\_DURATION\_BUCKETS**: readonly `number`[]

Defined in: [metrics.ts:21](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/metrics.ts#L21)

Explicit bucket boundaries (seconds) for the RPC call-duration histograms

The SDK default boundaries are a millisecond scale (`0, 5, 10, 25, ... 10000`), so every
RPC duration recorded in seconds would land in the first bucket and percentiles
would be unusable. These are the values the OpenTelemetry RPC metrics specification
recommends for `rpc.{server,client}.call.duration`. A `View` on a MeterProvider the application registers takes precedence over this advice.
