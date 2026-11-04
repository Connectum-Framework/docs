[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [serializer](../index.md) / createSerializerInterceptor

# Function: createSerializerInterceptor()

> **createSerializerInterceptor**(`options?`): `Interceptor`

Defined in: [serializer.ts:108](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/serializer.ts#L108)

Create serializer interceptor

Automatically serializes/deserializes messages to/from JSON.
By default, skips services whose protobuf type name starts with `grpc.`,
including the standard Health and Reflection services. This checks the
service namespace, regardless of the wire protocol used for the call.

A response that already is a message of the method's output type, which is what a handler
returns, is passed on as it is. Only a response that is JSON is parsed with
`ignoreUnknownFields`, so `ignoreUnknownFields: false` rejects unknown keys of such JSON and
never the `$typeName` marker of a message.

## Parameters

### options?

[`SerializerOptions`](../../interfaces/SerializerOptions.md) = `{}`

Serializer options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

**Server-side usage with createServer**

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

**Client-side usage with transport**

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createSerializerInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '1.1',
  interceptors: [
    createSerializerInterceptor({ alwaysEmitImplicit: true }),
  ],
});
```
