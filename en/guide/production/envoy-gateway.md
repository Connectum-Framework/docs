---
title: Envoy Gateway
description: Add an optional edge for native gRPC routing or explicitly configured REST transcoding.
docType: concept
outline: 2
---

# Envoy Gateway + OpenAPI

A gateway is an optional edge in front of your services. It can route native
gRPC traffic. With a separately configured transcoder and descriptors, it can
also turn an HTTP/JSON request into a gRPC call.

<figure class="technical-diagram guide-topic-diagram--wide" aria-label="An explicitly configured REST-to-gRPC path">

```mermaid
flowchart TD
    accTitle: Transcoding needs its own route and descriptors
    accDescr: A configured gateway can transcode HTTP JSON requests using protobuf descriptors while routing native gRPC separately. Both paths reach the Connectum service's application policy.
    JSON["HTTP/JSON client"] --> Transcode
    Native["gRPC client"] --> Route
    Descriptors["Protobuf<br/>descriptor set"] -.-> Transcode
    subgraph Gateway["Configured gateway"]
        Transcode["Route + transcoder"]
        Route["Native gRPC route"]
    end
    Transcode -->|gRPC| Service["Connectum service<br/>application policy"]
    Route -->|gRPC| Service
    class Transcode accent
```

<figcaption>Generating OpenAPI alone does not install a transcoder or expose a REST endpoint.</figcaption>
</figure>

## Keep the artifacts separate

**OpenAPI** describes the API for people and tools. The **descriptor set**
and **gateway configuration** make the transcoding path work. Native gRPC
clients can keep using the gRPC route without REST conversion.

## Go deeper

- [Configure annotations, descriptors, routes and transcoding](/en/guide/production/envoy-gateway-setup).
- [Generate the OpenAPI document](/en/guide/openapi).
- [Check the listener and proxy protocol](/en/guide/production/transport-matrix).

<GuideSections route="/en/guide/production/envoy-gateway" />
