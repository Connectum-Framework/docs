---
title: Testing
description: Choose the smallest Connectum testing layer that proves the behavior you changed.
docType: concept
outline: deep
---

<script setup>
import GuideOverview from '../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../.vitepress/theme/assets/diagrams/guide/testing.html?raw';
import MovedGuideSections from '../../.vitepress/theme/components/MovedGuideSections.vue';
import { movedTestingSections } from '../../.vitepress/guide/testing-sections.ts';
</script>

# Testing

Choose the boundary that can disprove the behavior you are testing: an isolated
decision, the assembled application, or the deployed service. Keep most business
cases in fast TypeScript tests and reserve deployed scenarios for protocol and
configuration boundaries.

<figure class="technical-diagram" data-guide-overview="testing" aria-label="Choose the testing boundary">
<GuideOverview :source="overview" />
<figcaption>Local tests bypass network, certificate and proxy configuration. Run success and failure scenarios against the real listener; plaintext gRPC and HTTP/1.1 require separate listener modes.</figcaption>
</figure>

For a server with the example Inventory implementation registered:

```typescript
import assert from 'node:assert/strict';
import { createLocalClient } from '@connectum/testing';

const client = createLocalClient(server, InventoryService);
const stock = await client.checkStock({ sku: 'A-1' });
assert.equal(stock.units, 7);
```

## Choose a layer

Start with [unit tests and fixtures](/en/guide/testing/unit), exercise application
wiring in [integration tests](/en/guide/testing/integration), then verify the
running service with [end-to-end tests](/en/guide/testing/e2e).

::: details Match a specific test task to a tool
| Question | Recommended surface |
|---|---|
| Does a handler or interceptor make the right decision? | [Unit tests with `@connectum/test-fixtures`](/en/guide/testing/unit) |
| Are routes, middleware and catalog dependencies wired correctly? | [Integration tests with `@connectum/testing`](/en/guide/testing/integration) |
| Do service-catalog calls resolve without a network listener? | [In-process transport](/en/guide/production/in-process-transport) |
| Does a running service expose correct gRPC, Connect, health, auth, TLS, or streaming behavior? | [runn](/en/guide/testing/runn) |
| Do you need Go plugins or JUnit-oriented scenario output? | [scenarigo](/en/guide/testing/scenarigo) |
:::

## Recommended path

1. Test handler and middleware decisions in process.
2. Start the real service with its generated proto contract.
3. Exercise one successful call and the important failure paths through `runn`.
4. Add deployment-specific probe or TLS scenarios only where that boundary matters.

Scenario tests catch serialization, validation, interceptor-order, reflection, and health-endpoint integration that isolated unit tests cannot. They should not repeat every business-rule case already covered in TypeScript.

Exact helper options live in the [`@connectum/testing` API](/en/api/@connectum/testing/)
and [`@connectum/test-fixtures` API](/en/api/@connectum/test-fixtures/).

## Topics

<GuideSection section="testing" />

<MovedGuideSections :entries="movedTestingSections" summary="Follow an earlier link to the integration testing details" />
