[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createClientBearerInterceptor

# Function: createClientBearerInterceptor()

> **createClientBearerInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/client-bearer-interceptor.ts:51](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/auth/src/client-bearer-interceptor.ts#L51)

Create a client interceptor that attaches a Bearer token to outgoing requests.

The interceptor sets the `Authorization: Bearer <token>` header on every
outgoing request. If a token factory function is provided instead of a
static string, it is called before each request to support token refresh.

## Parameters

### options

[`ClientBearerInterceptorOptions`](../interfaces/ClientBearerInterceptorOptions.md)

Configuration with a static token or async token factory

## Returns

`Interceptor`

A ConnectRPC client Interceptor

## Examples

```typescript
import { createClientBearerInterceptor } from '@connectum/auth';
import { createConnectTransport } from '@connectrpc/connect-node';

const transport = createConnectTransport({
    baseUrl: 'http://localhost:5000',
    interceptors: [createClientBearerInterceptor({
        token: 'my-static-jwt-token',
    })],
});
```

```typescript
import { createClientBearerInterceptor } from '@connectum/auth';

const transport = createConnectTransport({
    baseUrl: 'http://localhost:5000',
    interceptors: [createClientBearerInterceptor({
        token: async () => {
            const { accessToken } = await refreshTokenIfNeeded();
            return accessToken;
        },
    })],
});
```
