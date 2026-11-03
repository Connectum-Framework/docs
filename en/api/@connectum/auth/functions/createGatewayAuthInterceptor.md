[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createGatewayAuthInterceptor

# Function: createGatewayAuthInterceptor()

> **createGatewayAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/gateway-auth-interceptor.ts:204](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/gateway-auth-interceptor.ts#L204)

Create a gateway authentication interceptor.

Reads pre-authenticated identity from gateway-injected headers.
Trust is established by checking a designated header value against
a list of expected values: shared secrets, compared exactly, and, only with
`trustSource.allowCallerControlledCidr`, IPv4 CIDR blocks applied to the header value.
A trusted gateway must overwrite this header; it is not the connection's peer address.

Once the identity is read, the interceptor deletes every standard `x-auth-*` identity header
together with the mapped headers, the trust header and `stripHeaders` (also on `skipMethods`).
With `propagateHeaders` the verified identity is then written back, so an `x-auth-*` header seen
downstream comes from the verified identity, not from the client.

## Parameters

### options

[`GatewayAuthInterceptorOptions`](../interfaces/GatewayAuthInterceptorOptions.md)

Gateway auth configuration

## Returns

`Interceptor`

ConnectRPC interceptor

## Throws

When `headerMapping` or `trustSource` is not an object, or `trustSource.expectedValues`
  is not an array of non-empty strings (`[undefined]` from an unset environment variable included)

## Throws

When `headerMapping.subject` or `trustSource.expectedValues` is missing, `skipMethods`
  contains `"*"`, `defaultType` contains NUL, CR or LF (with `propagateHeaders`: or is empty, longer than 128
  characters or holds a lone surrogate), or `trustSource.expectedValues` contains a CIDR block
  while `trustSource.allowCallerControlledCidr` is not `true`

## Throws

When a header name in `headerMapping`, `trustSource.header` or `stripHeaders` is not a valid HTTP header name

## Example

**Kong/Envoy gateway with shared secret**

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
