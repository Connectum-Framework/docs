---
title: Kubernetes
description: Run the service image as a workload and let readiness control which replicas receive traffic.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../../.vitepress/theme/assets/diagrams/guide/kubernetes.html?raw';
</script>

# Kubernetes Deployment

Kubernetes runs and replaces your service processes. Connectum owns what
happens inside each process; Kubernetes owns placement, replicas and how
traffic reaches them.

<figure class="technical-diagram" data-guide-overview="kubernetes" aria-label="Configure replicas and control readiness">
<GuideOverview :source="overview" />
<figcaption>Configuration recipes are not a live-validated rollout. Derive resources and scaling from the workload. Keep readiness separate from RPC traffic and budget termination for preStop, drain, hooks and a safety margin.</figcaption>
</figure>

## What you configure

- **A Deployment:** the image, resources, configuration and replica lifecycle.
- **A Service:** an address and protocol compatible with the callers.
- **Probes and shutdown:** readiness before traffic, then drain within the pod's grace period.

Keep credentials outside the image. Set resource and scaling values from your
workload, not by copying the example's replica counts.

## Go deeper

- [Apply the full deployment recipe and inspect its manifests](/en/guide/production/kubernetes-configuration).
- [Connect readiness, liveness and termination](/en/guide/health-checks/kubernetes).
- [Choose the listener and upstream protocol](/en/guide/production/transport-matrix).

<GuideSections route="/en/guide/production/kubernetes" />
