[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createClientGatewayInterceptor

# Function: createClientGatewayInterceptor()

> **createClientGatewayInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/client-gateway-interceptor.ts:52](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/auth/src/client-gateway-interceptor.ts#L52)

Create a client interceptor that attaches gateway auth headers to outgoing requests.

Sets the following headers for service-to-service communication:
- `x-gateway-secret` — shared secret for trust verification
- `x-auth-subject` — authenticated subject identifier
- `x-auth-roles` — JSON-encoded roles array (optional)

These headers are consumed by the server-side [createGatewayAuthInterceptor](createGatewayAuthInterceptor.md)
to reconstruct the auth context without re-authentication.

## Parameters

### options

[`ClientGatewayInterceptorOptions`](../interfaces/ClientGatewayInterceptorOptions.md)

Gateway auth configuration

## Returns

`Interceptor`

A ConnectRPC client Interceptor

## Example

**Service-to-service call**

```typescript
import { createClientGatewayInterceptor } from '@connectum/auth';
import { createConnectTransport } from '@connectrpc/connect-node';

const transport = createConnectTransport({
    baseUrl: 'http://internal-service:5000',
    interceptors: [createClientGatewayInterceptor({
        secret: process.env.GATEWAY_SECRET!,
        subject: 'order-service',
        roles: ['service', 'order-writer'],
    })],
});
```
