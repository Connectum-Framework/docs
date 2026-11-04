---
title: Serialization interceptor
description: Use protobuf JSON shapes deliberately inside a handler pipeline.
docType: how-to
---

# Serialization interceptor

Ordinary Connect JSON calls need no serialization interceptor: the ConnectRPC
transport already handles protobuf JSON encoding. Use the server's `jsonOptions`
for wire JSON settings.

The optional interceptor instead converts the request message to JSON before
`next()` and converts its response back to a protobuf message. The inner handler
must deliberately accept and return protobuf JSON shapes.

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const interceptors = createDefaultInterceptors({
  serializer: {
    alwaysEmitImplicit: true,
    ignoreUnknownFields: false,
  },
});
```

`serializer: true` opts into its default settings. Normal protobuf handlers
over Connect or gRPC should leave it disabled. In a manual chain use
`createSerializerInterceptor(options)`; serialization is innermost in the
default chain, closest to the handler.

`skipGrpcServices`, `alwaysEmitImplicit` and `ignoreUnknownFields` accept only
booleans. Other types throw `TypeError` at construction; a string such as
`"no"` is not interpreted by truthiness.

See [SerializerOptions](/en/api/@connectum/interceptors/interfaces/SerializerOptions)
for exact settings and [server configuration](/en/guide/server/configuration)
for transport-level JSON configuration.
