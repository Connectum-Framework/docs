---
title: '@connectum/test-fixtures'
description: Low-level mock requests, descriptors, streams, next functions, and assertions for framework and tooling tests.
docType: package-hub
---

# @connectum/test-fixtures

Low-level mock requests, descriptors, streams, next functions, and assertions for framework and tooling tests.

## Install {#installation}

::: pm
== npm
~~~bash
npm install -D @connectum/test-fixtures
~~~
== pnpm
~~~bash
pnpm add -D @connectum/test-fixtures
~~~
== bun
~~~bash
bun add -d @connectum/test-fixtures
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { createMockNext, createMockRequest } from '@connectum/test-fixtures';

const request = createMockRequest();
const next = createMockNext({ message: { ok: true } });
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `createMockRequest` | Build a ConnectRPC request fixture. |
| `createFakeService` | Build descriptor-compatible fake services. |
| `createMockStream` | Create deterministic streaming inputs. |

Architecture-layer and dependency details remain in the [Architecture Overview](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/testing)
- **Configure:** [Task and configuration guidance](/en/guide/interceptors/custom)
- **API reference:** [Exact options and symbols](/en/api/@connectum/test-fixtures/types/interfaces/MockRequestOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/test-fixtures/)
- **Source:** [@connectum/test-fixtures on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/test-fixtures)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="what-lives-here"></span>
<span id="example"></span>
</div>
