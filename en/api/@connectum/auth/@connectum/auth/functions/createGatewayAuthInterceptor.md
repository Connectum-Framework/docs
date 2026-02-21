[Connectum API Reference](../../../../../index.md) / [@connectum/auth](../../../index.md) / [@connectum/auth](../index.md) / createGatewayAuthInterceptor

# Function: createGatewayAuthInterceptor()

> **createGatewayAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/gateway-auth-interceptor.ts:92](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/gateway-auth-interceptor.ts#L92)

Create a gateway authentication interceptor.

Reads pre-authenticated identity from gateway-injected headers.
Trust is established by checking a designated header value against
a list of expected values (shared secrets or trusted IP ranges).

## Parameters

### options

[`GatewayAuthInterceptorOptions`](../interfaces/GatewayAuthInterceptorOptions.md)

Gateway auth configuration

## Returns

`Interceptor`

ConnectRPC interceptor

## Example

```typescript
const gatewayAuth = createGatewayAuthInterceptor({
  headerMapping: {
    subject: 'x-user-id',
    name: 'x-user-name',
    roles: 'x-user-roles',
  },
  trustSource: {
    header: 'x-gateway-secret',
    expectedValues: [process.env.GATEWAY_SECRET],
  },
});
```
