---
layout: home
title: Connectum — gRPC and ConnectRPC for Node.js
description: Build production-ready TypeScript microservices with explicit contracts, middleware, security, observability, and operations.
pageClass: home-page
docType: landing
---

<script setup>
import HomePage from '../.vitepress/theme/components/HomePage.vue'
</script>

<HomePage>
<template #server-example>

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck } from '@connectum/healthcheck';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { Reflection } from '@connectum/reflection';
import { greeterService } from './services/greeterService.ts';

const server = createServer({
  services: [greeterService],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: createDefaultInterceptors(),
  shutdown: { autoShutdown: true },
});

await server.start();
```

</template>
</HomePage>
