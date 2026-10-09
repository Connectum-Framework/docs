---
title: Configure Mutual TLS
description: Require and verify client certificates for service-to-service Connectum traffic.
docType: how-to
outline: deep
---

# Mutual TLS (mTLS)

Mutual TLS enables both client and server to authenticate each other, providing strong identity verification for service-to-service communication.

**Outcome:** the server rejects callers without a certificate issued by the configured CA. Certificate loading and basic server TLS are owned by [TLS configuration](/en/guide/security/tls); this page owns client-certificate policy and deployment safety.

## mTLS Configuration

For mutual TLS, use the `http2Options` parameter alongside `tls`:

```typescript
import { readFileSync } from 'node:fs';
import { createServer } from '@connectum/core';
import { Reflection } from '@connectum/reflection';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Reflection()],
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
| `requestCert` | Ask the client for a certificate; combine with `rejectUnauthorized: true` to enforce verification |
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

Use application-owned environment variables to avoid hardcoding paths.
`TLS_KEY_PATH`, `TLS_CERT_PATH`, and `TLS_CA_PATH` in this example are read by
your application; Connectum does not automatically load those file variables.
For an mTLS-only service, fail startup if the paths are absent
and retain the client-certificate policy:

```typescript
const { TLS_KEY_PATH: keyPath, TLS_CERT_PATH: certPath, TLS_CA_PATH: caPath } = process.env;
if (!keyPath || !certPath || !caPath) {
  throw new Error('TLS_KEY_PATH, TLS_CERT_PATH, and TLS_CA_PATH are required');
}

const server = createServer({
  services: [routes],
  tls: { keyPath, certPath },
  http2Options: {
    requestCert: true,
    rejectUnauthorized: true,
    ca: readFileSync(caPath),
  },
});
```

### Kubernetes TLS with Secrets

Mount the key, certificate, and CA as Kubernetes secrets. The TLS loading
directory expects files named `server.key` and `server.crt`; this example also
mounts `ca.crt` for client verification. This is a Pod manifest excerpt:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-service
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
  http2Options: {
    requestCert: true,
    rejectUnauthorized: true,
    ca: readFileSync('/etc/tls/ca.crt'),
  },
});
```

::: danger Security
Never commit TLS private keys to version control. Use environment variables, secrets managers, or mounted volumes in production.
:::

### Enforce TLS 1.3

To require TLS 1.3 while preserving mutual authentication, keep the client
certificate options as well:

```typescript
const server = createServer({
  services: [routes],
  tls: {
    keyPath: './keys/server.key',
    certPath: './keys/server.crt',
  },
  http2Options: {
    minVersion: 'TLSv1.3',
    requestCert: true,
    rejectUnauthorized: true,
    ca: readFileSync('./keys/ca.crt'),
  },
});
```

## Related

- [Security Overview](/en/guide/security) -- back to overview
- [TLS Configuration](/en/guide/security/tls) -- TLS options, utility functions, self-signed certs
- [Kubernetes Deployment](/en/guide/production/kubernetes) -- full deployment guide
- [@connectum/core](/en/packages/core) -- Package Guide
- [@connectum/core API](/en/api/@connectum/core/) -- Full API Reference
