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

<GuideFlow scene="production/envoy-gateway">
<figure class="guide-map" aria-label="An explicitly configured REST-to-gRPC path">
<ol>
<li><strong>HTTP/JSON client</strong><small>A request uses the path defined by your API annotations.</small></li>
<li><strong>Gateway + transcoder</strong><small>Routing and protobuf descriptors translate the request.</small></li>
<li><strong>Connectum service</strong><small>The gRPC handler runs with its normal application policy.</small></li>
</ol>
<figcaption>Generating OpenAPI alone does not install a transcoder or expose a REST endpoint.</figcaption>
</figure>
</GuideFlow>

## Keep the artifacts separate

**OpenAPI** describes the API for people and tools. The **descriptor set**
and **gateway configuration** make the transcoding path work. Native gRPC
clients can keep using the gRPC route without REST conversion.

## Go deeper

- [Configure annotations, descriptors, routes and transcoding](/en/guide/production/envoy-gateway-setup).
- [Generate the OpenAPI document](/en/guide/openapi).
- [Check the listener and proxy protocol](/en/guide/production/transport-matrix).

<GuideSections route="/en/guide/production/envoy-gateway" />
