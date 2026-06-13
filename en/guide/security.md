---
outline: deep
---

# Security

Built-in TLS and mTLS for secure gRPC/ConnectRPC communication over HTTP/2.

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  tls: {
    dirPath: './keys',  // Looks for server.key + server.crt
  },
});

await server.start();
```

When TLS is configured, Connectum creates an HTTP/2 secure server (`http2.createSecureServer`) with ALPN negotiation. Without TLS, the default server is **plaintext HTTP/1.1** (`http.createServer`, since `allowHTTP1` defaults to `true`); set `allowHTTP1: false` to get a plaintext HTTP/2 (h2c) server instead. See the [transport matrix](/en/guide/production/transport-matrix) for which RPC types each transport supports.

## Key Concepts

| Concept | Description |
|---------|-------------|
| **TLS Options** | `keyPath` + `certPath` for explicit paths, or `dirPath` for directory-based config |
| **Environment Variables** | `TLS_DIR_PATH`, `TLS_KEY_PATH`, `TLS_CERT_PATH` for deployment flexibility |
| **mTLS** | Mutual TLS via `http2Options`: `requestCert`, `rejectUnauthorized`, `ca` |
| **Transports** | Without TLS: HTTP/1.1 by default, h2c with `allowHTTP1: false`; with TLS: ALPN (HTTP/2 + HTTP/1.1). See the [transport matrix](/en/guide/production/transport-matrix) |
| **Utility Functions** | `readTLSCertificates()`, `getTLSPath()` from `@connectum/core` |

## Learn More

- [TLS Configuration](/en/guide/security/tls) -- TLS options, utility functions, self-signed certs, testing
- [Mutual TLS (mTLS)](/en/guide/security/mtls) -- mTLS setup, production best practices, Kubernetes secrets
- [@connectum/core](/en/packages/core) -- Package Guide
- [@connectum/core API](/en/api/@connectum/core/) -- Full API Reference
