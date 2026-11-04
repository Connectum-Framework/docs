---
title: Envoy Gateway
description: Add an optional edge for native gRPC routing or explicitly configured REST transcoding.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../../.vitepress/theme/assets/diagrams/guide/envoy.html?raw';
</script>

# Envoy Gateway + OpenAPI

A gateway is an optional edge in front of your services. It can route native
gRPC traffic. With a separately configured transcoder and descriptors, it can
also turn an HTTP/JSON request into a gRPC call.

<figure class="technical-diagram" data-guide-overview="envoy" aria-label="Keep gateway artifacts separate">
<GuideOverview :source="overview" />
<figcaption>Integration plan, not a live-validated manifest set. OpenAPI and Swagger UI document the API; descriptors, mounts, routes and the enabled filter implement transcoding. Native gRPC keeps its own route.</figcaption>
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
