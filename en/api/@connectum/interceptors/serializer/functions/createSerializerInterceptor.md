[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [serializer](../index.md) / createSerializerInterceptor

# Function: createSerializerInterceptor()

> **createSerializerInterceptor**(`options?`): `Interceptor`

Defined in: [serializer.ts:84](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/serializer.ts#L84)

Create serializer interceptor

Automatically serializes/deserializes messages to/from JSON.
Skips gRPC services by default (they use protobuf binary format).

## Parameters

### options?

[`SerializerOptions`](../../@connectum/interceptors/interfaces/SerializerOptions.md) = `{}`

Serializer options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

```typescript
import { createServer } from '@connectum/core';
import { createSerializerInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createSerializerInterceptor({
      skipGrpcServices: true,
      alwaysEmitImplicit: true,
      ignoreUnknownFields: true,
    }),
  ],
});

await server.start();
```

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createSerializerInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  interceptors: [
    createSerializerInterceptor({ alwaysEmitImplicit: true }),
  ],
});
```
