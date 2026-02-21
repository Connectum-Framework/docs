---
outline: deep
---

# TLS Configuration

Configure TLS for secure gRPC/ConnectRPC communication in Connectum services.

## TLS Options

The `tls` option in `createServer()` accepts a `TLSOptions` object:

```typescript
interface TLSOptions {
  /** Path to TLS private key file */
  keyPath?: string;

  /** Path to TLS certificate file */
  certPath?: string;

  /** TLS directory path (alternative to keyPath/certPath) */
  dirPath?: string;
}
```

### Explicit File Paths

Provide paths directly to the key and certificate files:

```typescript
const server = createServer({
  services: [routes],
  tls: {
    keyPath: './keys/server.key',
    certPath: './keys/server.crt',
  },
});
```

Paths are resolved relative to the current working directory.

### Directory-Based Configuration

Point to a directory containing `server.key` and `server.crt`:

```typescript
const server = createServer({
  services: [routes],
  tls: {
    dirPath: './keys',
  },
});
```

The server looks for:
- `<dirPath>/server.key`
- `<dirPath>/server.crt`

### Environment Variable Configuration

TLS paths can also be set via environment variables:

| Variable | Description |
|----------|-------------|
| `TLS_DIR_PATH` | Directory containing `server.key` and `server.crt` |
| `TLS_KEY_PATH` | Path to TLS private key file |
| `TLS_CERT_PATH` | Path to TLS certificate file |

When no explicit paths are provided, the `readTLSCertificates()` utility falls back to the `TLS_DIR_PATH` environment variable.

## TLS Utility Functions

### readTLSCertificates()

Reads TLS key and certificate files:

```typescript
import { readTLSCertificates } from '@connectum/core';

// With explicit paths
const { key, cert } = readTLSCertificates({
  keyPath: './keys/server.key',
  certPath: './keys/server.crt',
});

// With directory path
const { key, cert } = readTLSCertificates({
  dirPath: './keys',
});

// With default TLS path (from TLS_DIR_PATH env or convention)
const { key, cert } = readTLSCertificates();
```

### getTLSPath()

Returns the TLS directory path based on environment and convention:

```typescript
import { getTLSPath } from '@connectum/core';

const path = getTLSPath();
// In production (NODE_ENV=production): current working directory
// In development: ../../keys relative to cwd
// Overridden by: TLS_DIR_PATH environment variable
```

## Self-Signed Certificates for Development

Generate self-signed certificates for local development:

```bash
# Create keys directory
mkdir -p keys

# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -newkey rsa:4096 \
  -keyout keys/server.key \
  -out keys/server.crt \
  -days 365 \
  -nodes \
  -subj "/C=US/ST=Local/L=Local/O=Dev/CN=localhost"
```

Use in your service:

```typescript
const server = createServer({
  services: [routes],
  port: 5000,
  tls: {
    dirPath: './keys',
  },
});
```

::: warning Development only
Self-signed certificates should only be used in development. For production, use certificates from a trusted Certificate Authority (CA) or a service like Let's Encrypt.
:::

## Testing with TLS

When testing with grpcurl against a TLS-enabled server using self-signed certificates:

```bash
# Skip certificate verification (development only)
grpcurl -insecure localhost:5000 list

# Or provide the CA certificate
grpcurl -cacert keys/server.crt localhost:5000 list
```

With curl:

```bash
# Skip certificate verification
curl -k https://localhost:5000/healthz

# Or provide the CA certificate
curl --cacert keys/server.crt https://localhost:5000/healthz
```

## Additional HTTP/2 Options

Use `http2Options` for any additional Node.js HTTP/2 secure server options:

```typescript
const server = createServer({
  services: [routes],
  port: 5000,
  tls: {
    keyPath: './keys/server.key',
    certPath: './keys/server.crt',
  },
  http2Options: {
    // Minimum TLS version
    minVersion: 'TLSv1.3',
    // Cipher suites
    ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256',
    // Session timeout
    sessionTimeout: 300,
  },
  // Handshake timeout
  handshakeTimeout: 30000,
});
```

## HTTP/1.1 Support

By default, Connectum allows HTTP/1.1 connections (via ALPN negotiation). This is important for ConnectRPC clients that use HTTP/1.1 with JSON:

```typescript
const server = createServer({
  services: [routes],
  tls: { dirPath: './keys' },
  allowHTTP1: true,    // default: true
});
```

To restrict to HTTP/2 only:

```typescript
const server = createServer({
  services: [routes],
  tls: { dirPath: './keys' },
  allowHTTP1: false,
});
```

## Related

- [Security Overview](/en/guide/security) -- back to overview
- [Mutual TLS (mTLS)](/en/guide/security/mtls) -- client certificate authentication, production best practices
- [@connectum/core](/en/packages/core) -- Package Guide
- [@connectum/core API](/en/api/@connectum/core/) -- Full API Reference
