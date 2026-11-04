[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createClientBearerInterceptor

# Function: createClientBearerInterceptor()

> **createClientBearerInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/client-bearer-interceptor.ts:58](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/client-bearer-interceptor.ts#L58)

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

## Throws

When `token` is neither a non-empty string nor a function

A token factory that returns anything but a non-empty string (`undefined` or `null` after a failed
refresh) fails that call with `Code.Unauthenticated` before any request is sent; the header is
never set to the text `Bearer undefined`.

## Examples

**Static token**

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

**Async token factory (refresh)**

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
