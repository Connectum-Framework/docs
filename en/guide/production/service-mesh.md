---
title: Service Mesh
description: Put workload connection policy in the mesh while keeping application identity and method policy explicit.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../../.vitepress/theme/assets/diagrams/guide/mesh.html?raw';
</script>

# Istio Service Mesh

A mesh can secure and manage connections between service workloads. It is
not required for Connectum: add it when your deployment needs workload mTLS,
traffic policy or mesh-level visibility.

<figure class="technical-diagram" data-guide-overview="mesh" aria-label="Separate mesh and application policy">
<GuideOverview :source="overview" />
<figcaption>Recipe overview, not a live-validated mesh deployment. Workload identity does not authorize a user RPC. Retain application TLS when required by the deployment, and coordinate retry ownership and budgets.</figcaption>
</figure>

## One owner for each policy

Keep protobuf contracts and business authorization in the application.
Configure connection policy in the mesh. Coordinate retries and circuit
breakers across both layers so attempts and timeout budgets do not multiply.

## Go deeper

- [Configure Istio mTLS, traffic rules and observability](/en/guide/production/service-mesh-setup).
- [Compare mesh and application circuit breakers](/en/guide/production/service-mesh-setup#circuit-breaking-mesh-vs-application).
- [Configure application identity](/en/guide/auth).

<GuideSections route="/en/guide/production/service-mesh" />
