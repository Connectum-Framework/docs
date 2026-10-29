---
title: Server Reflection
description: Let a client ask a running server which services and message schemas it exposes.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../../.vitepress/theme/assets/diagrams/guide/reflection.html?raw';
</script>

# Server Reflection

You know a server's address, but do not have its `.proto` files. Reflection
lets tools such as grpcurl ask that server for its service and message schemas.

<figure class="technical-diagram" data-guide-overview="reflection" aria-label="Reflection setup, queries and exposure">
<GuideOverview :source="overview" />
<figcaption>Reflection exposes schemas at one known address; it does not locate servers or replace the generated catalog. Protocol order controls which mounted services appear. Disable or restrict production exposure.</figcaption>
</figure>

## Add it explicitly

With `routes` containing your service handlers:

```typescript
import { createServer } from '@connectum/core';
import { Reflection } from '@connectum/reflection';

const server = createServer({
  services: [routes],
  allowHTTP1: false,
  protocols: [Reflection()],
});
```

After starting this plaintext HTTP/2 server, a reflection client can query it.
Restrict reflection exposure in production: the schema itself may be sensitive.

## Not the service catalog

The [service catalog](/en/guide/service-communication/service-catalog) is
generated contract knowledge used by your application. Reflection exposes
mounted schema information to external tools at runtime.

## Go deeper

[Install reflection, run grpcurl and buf curl, and configure exposure](/en/guide/protocols/reflection-tools).

<GuideSections route="/en/guide/protocols/reflection" />
