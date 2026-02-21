[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [serializer](../index.md) / createSerializerInterceptor

# Function: createSerializerInterceptor()

> **createSerializerInterceptor**(`options?`): `Interceptor`

Defined in: [serializer.ts:84](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/interceptors/src/serializer.ts#L84)

Create serializer interceptor

Automatically serializes/deserializes messages to/from JSON.
Skips gRPC services by default (they use protobuf binary format).

## Parameters

### options?

[`SerializerOptions`](../../interfaces/SerializerOptions.md) = `{}`

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
