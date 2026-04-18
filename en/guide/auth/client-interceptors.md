---
outline: deep
---

# Client-Side Auth Interceptors

Server-side interceptors (`createGatewayAuthInterceptor`, `createJwtAuthInterceptor`, etc.) validate incoming requests. **Client-side** interceptors do the opposite -- they attach credentials to outgoing requests.

Connectum provides two client interceptor factories for common auth patterns:

| Factory | Purpose | Header set |
|---------|---------|------------|
| `createClientBearerInterceptor` | Attach a Bearer token | `Authorization: Bearer <token>` |
| `createClientGatewayInterceptor` | Service-to-service trust | `x-gateway-secret`, `x-auth-subject`, `x-auth-roles` |

## Bearer Token

Use `createClientBearerInterceptor` when your service calls another service that expects a Bearer token (JWT, opaque token, API key in Bearer format).

### Static token

```typescript
import { createClientBearerInterceptor } from '@connectum/auth';
import { createConnectTransport } from '@connectrpc/connect-node';

const transport = createConnectTransport({
  baseUrl: 'http://internal-api:5000',
  interceptors: [
    createClientBearerInterceptor({ token: process.env.API_TOKEN! }),
  ],
});
```

### Async token factory (refresh flow)

When the token may expire, pass an async function. It is called before every request:

```typescript
import { createClientBearerInterceptor } from '@connectum/auth';

const bearerAuth = createClientBearerInterceptor({
  token: async () => {
    const { accessToken } = await refreshTokenIfNeeded();
    return accessToken;
  },
});
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `token` | `string \| () => Promise<string>` | Yes | Static token or async factory called before each request |

## Gateway (Service-to-Service)

Use `createClientGatewayInterceptor` when calling a service behind a gateway that uses `createGatewayAuthInterceptor` on the server side. The client interceptor sets the trust headers that the server interceptor reads.

```typescript
import { createClientGatewayInterceptor } from '@connectum/auth';
import { createConnectTransport } from '@connectrpc/connect-node';

const transport = createConnectTransport({
  baseUrl: 'http://order-service:5001',
  interceptors: [
    createClientGatewayInterceptor({
      secret: process.env.GATEWAY_SECRET!,
      subject: 'task-coordinator',
      roles: ['service', 'order-writer'],
    }),
  ],
});
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `secret` | `string` | Yes | Shared secret matching the server's `trustSource.expectedValues` |
| `subject` | `string` | Yes | Service identity (appears as `AuthContext.subject` on the server) |
| `roles` | `string[]` | No | Roles to propagate (JSON-encoded in `x-auth-roles` header) |

### Header mapping

The client interceptor sets these headers:

| Header | Source | Server reads via |
|--------|--------|-----------------|
| `x-gateway-secret` | `options.secret` | `trustSource.header` |
| `x-auth-subject` | `options.subject` | `headerMapping.subject` |
| `x-auth-roles` | `JSON.stringify(options.roles)` | `headerMapping.roles` |

When `roles` is omitted or empty, the `x-auth-roles` header is not set.

## Combining with other interceptors

Client auth interceptors compose naturally with other interceptors:

```typescript
import { createClientGatewayInterceptor } from '@connectum/auth';
import { createOtelClientInterceptor } from '@connectum/otel';
import { createConnectTransport } from '@connectrpc/connect-node';

const transport = createConnectTransport({
  baseUrl: 'http://order-service:5001',
  interceptors: [
    createOtelClientInterceptor(),       // tracing
    createClientGatewayInterceptor({     // auth
      secret: process.env.GATEWAY_SECRET!,
      subject: 'api-gateway',
      roles: ['gateway'],
    }),
  ],
});
```

## Server ↔ Client pairing

| Client interceptor | Server interceptor | Trust mechanism |
|---|---|---|
| `createClientBearerInterceptor` | `createJwtAuthInterceptor` | JWT signature verification |
| `createClientBearerInterceptor` | `createSessionAuthInterceptor` | Session token lookup |
| `createClientGatewayInterceptor` | `createGatewayAuthInterceptor` | Shared secret header |
