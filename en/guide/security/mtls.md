---
outline: deep
---

# Mutual TLS (mTLS)

Mutual TLS enables both client and server to authenticate each other, providing strong identity verification for service-to-service communication.

## mTLS Configuration

For mutual TLS, use the `http2Options` parameter alongside `tls`:

```typescript
import { readFileSync } from 'node:fs';
import { createServer, readTLSCertificates } from '@connectum/core';

const server = createServer({
  services: [routes],
  port: 5000,
  tls: {
    keyPath: './keys/server.key',
    certPath: './keys/server.crt',
  },
  http2Options: {
    // Require client certificates
    requestCert: true,
    rejectUnauthorized: true,
    // CA certificate(s) used to verify client certificates
    ca: readFileSync('./keys/ca.crt'),
  },
});

await server.start();
```

| Option | Description |
|--------|-------------|
| `requestCert` | Require the client to present a certificate |
| `rejectUnauthorized` | Reject connections with invalid/untrusted certificates |
| `ca` | CA certificate(s) used to verify client certificates |

## mTLS Client Configuration

When connecting to an mTLS-enabled server:

```bash
# grpcurl with client certificate
grpcurl \
  -cacert keys/ca.crt \
  -cert keys/client.crt \
  -key keys/client.key \
  localhost:5000 list
```

## Production TLS Best Practices

### Use a Certificate Manager

In production, manage certificates through:

- **Kubernetes cert-manager** for automatic certificate provisioning and renewal
- **Vault** (HashiCorp) for certificate management
- **Let's Encrypt** for free, automated certificates

### Environment-Based Configuration

Use environment variables to avoid hardcoding paths:

```typescript
const server = createServer({
  services: [routes],
  port: 5000,
  tls: process.env.TLS_ENABLED === 'true'
    ? {
        keyPath: process.env.TLS_KEY_PATH,
        certPath: process.env.TLS_CERT_PATH,
      }
    : undefined,
});
```

### Kubernetes TLS with Secrets

Mount TLS certificates as Kubernetes secrets:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: my-service
      image: my-service:latest
      env:
        - name: TLS_DIR_PATH
          value: /etc/tls
      volumeMounts:
        - name: tls-certs
          mountPath: /etc/tls
          readOnly: true
  volumes:
    - name: tls-certs
      secret:
        secretName: my-service-tls
```

```typescript
const server = createServer({
  services: [routes],
  tls: {
    dirPath: process.env.TLS_DIR_PATH,
  },
});
```

::: danger Security
Never commit TLS private keys to version control. Use environment variables, secrets managers, or mounted volumes in production.
:::

### Enforce TLS 1.3

For maximum security, enforce TLS 1.3:

```typescript
const server = createServer({
  services: [routes],
  tls: {
    keyPath: './keys/server.key',
    certPath: './keys/server.crt',
  },
  http2Options: {
    minVersion: 'TLSv1.3',
  },
});
```

## Related

- [Security Overview](/en/guide/security) -- back to overview
- [TLS Configuration](/en/guide/security/tls) -- TLS options, utility functions, self-signed certs
- [Kubernetes Deployment](/en/guide/production/kubernetes) -- full deployment guide
- [@connectum/core](/en/packages/core) -- Package Guide
- [@connectum/core API](/en/api/@connectum/core/) -- Full API Reference
