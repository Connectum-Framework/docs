---
title: Testing
description: Choose the smallest Connectum testing layer that proves the behavior you changed.
docType: concept
outline: deep
---

# Testing

Connectum supports two complementary testing layers. Use TypeScript tests for fast handler and transport feedback, then scenario tests for the deployed protocol boundary.

<GuideFlow scene="testing">
<figure class="guide-map" aria-label="Test from a small decision to the deployed boundary">
<ol>
<li><strong>Handler decision</strong><small>Check business results and errors in TypeScript.</small></li>
<li><strong>In-process RPC</strong><small>Exercise the configured router and middleware without a listener.</small></li>
<li><strong>Real connection</strong><small>Check protocol, TLS, probes and deployed integration.</small></li>
</ol>
<figcaption>A passing local test does not prove that a proxy or certificate is configured correctly.</figcaption>
</figure>
</GuideFlow>

For a server with the example Inventory implementation registered:

```typescript
import assert from 'node:assert/strict';
import { createLocalClient } from '@connectum/testing';

const client = createLocalClient(server, InventoryService);
const stock = await client.checkStock({ sku: 'A-1' });
assert.equal(stock.units, 7);
```

## Choose a layer

Use [testing helpers](/en/packages/testing) for fast TypeScript feedback, then
[runn](/en/guide/testing/runn) for the live service boundary.

::: details Match a specific test task to a tool
| Question | Recommended surface |
|---|---|
| Does a handler or interceptor return the expected value/error? | [`@connectum/testing`](/en/packages/testing) with an in-process server/client |
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

For executable end-to-end suites, see the examples' tests: [hris](https://github.com/Connectum-Framework/examples/tree/main/hris/tests) runs its whole flow in one process (the monolith topology, with an in-memory EventBus and a PGlite database), and every `with-events-*` example runs its saga against a real broker and separate services through `docker compose`. Exact testing helpers remain in the [`@connectum/testing` API](/en/api/@connectum/testing/); shared low-level fixtures are separated in [`@connectum/test-fixtures`](/en/packages/test-fixtures).
