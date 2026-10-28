---
title: Transport Matrix
description: Choose HTTP/1.1, h2c or TLS according to the protocol your clients actually speak.
docType: concept
outline: 2
---

# Transport Matrix

The important question is not just “HTTP or gRPC?” It is whether the client,
proxy and server agree on a protocol all the way through.

<figure class="technical-diagram" aria-label="Every leg must support the requested protocol">

```mermaid
flowchart TD
    accTitle: Keep native gRPC on HTTP/2 across every leg
    accDescr: A native gRPC client needs HTTP/2 both to the proxy and from the proxy to the server. An HTTP/1.1 upstream leg breaks that native gRPC path even if the edge accepts HTTP/2.
    Client["Native gRPC client"] -->|HTTP/2| Proxy["Proxy"]
    Proxy -->|HTTP/2 upstream| Server["h2c or TLS + ALPN<br/>server listener"]
    Proxy -.-> Broken["HTTP/1.1 upstream<br/>not native gRPC"]
    class Server accent
    class Broken critical
```

<figcaption>HTTP/2 at the edge does not guarantee HTTP/2 reaches the application.</figcaption>
</figure>

## The common choices

- **Connect over plaintext HTTP/1.1:** the default listener; not native gRPC.
- **Native gRPC on an internal plaintext connection:** set `allowHTTP1: false` for h2c.
- **A mixed HTTP/1.1 and HTTP/2 port:** use TLS + ALPN, or a suitable proxy.

A single plaintext listener does not automatically serve both HTTP versions.
Bidirectional streaming must stay on HTTP/2, including through intermediaries.

## Go deeper

- [The complete support matrix, startup diagnostics and residual risks](/en/guide/production/transport-matrix-details).
- [Historical measurements and untested combinations](/en/guide/production/transport-matrix-details#verified).
- [Configure TLS](/en/guide/security/tls).

<GuideSections route="/en/guide/production/transport-matrix" />
