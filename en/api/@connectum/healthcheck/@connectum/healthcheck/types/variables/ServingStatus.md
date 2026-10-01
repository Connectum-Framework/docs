[Connectum API Reference](../../../../../../index.md) / [@connectum/healthcheck](../../../../index.md) / [@connectum/healthcheck/types](../index.md) / ServingStatus

# Variable: ServingStatus

> `const` **ServingStatus**: *typeof* [`HealthCheckResponse_ServingStatus`](https://github.com/grpc/grpc-proto/blob/master/grpc/health/v1/health.proto) = `HealthCheckResponse_ServingStatus`

Defined in: [types.ts:17](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L17)

Service serving status

The `HealthCheckResponse.ServingStatus` enum of the standard gRPC Health
Checking Protocol (`grpc.health.v1`), re-exported from the generated code.
Values: `UNKNOWN` (0), `SERVING` (1), `NOT_SERVING` (2) and
`SERVICE_UNKNOWN` (3), which the protocol uses only in `Watch` responses.
