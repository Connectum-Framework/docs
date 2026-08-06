---
title: '@connectum/cli'
description: Command-line scaffolding, service generation, package-version reporting, and reflection-based proto synchronization.
docType: package-hub
---

# @connectum/cli

Command-line scaffolding, service generation, package-version reporting, and reflection-based proto synchronization.

## Install {#installation}

::: pm
== npm
~~~bash
npm install -D @connectum/cli
~~~
== pnpm
~~~bash
pnpm add -D @connectum/cli
~~~
== bun
~~~bash
bun add -d @connectum/cli
~~~
:::

## Start Here {#quick-start}

~~~bash
npx connectum init payments
cd payments
npx connectum generate service invoices
npx connectum --version
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `connectum init` | Create a service from the version-pinned official base. |
| `connectum generate service` | Add a service contract and implementation. |
| `connectum proto sync` | Discover and generate types from server reflection. |

Runtime boundaries and extension seams remain in [Connectum Runtime Architecture](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/scaffolding)
- **Configure:** [Task and configuration guidance](/en/guide/protocols/reflection)
- **API reference:** [Exact options and symbols](/en/api/@connectum/cli/commands/proto-sync/interfaces/ProtoSyncOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/cli/)
- **Source:** [@connectum/cli on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/cli)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="commands"></span>
<span id="connectum-version"></span>
<span id="connectum-proto-sync"></span>
<span id="pipeline"></span>
<span id="arguments"></span>
<span id="examples"></span>
<span id="dry-run-output"></span>
<span id="executeprotosyncoptions"></span>
<span id="reflection-utilities"></span>
<span id="fetchreflectiondataurl"></span>
<span id="fetchfiledescriptorsetbinaryurl"></span>
<span id="prerequisites"></span>
<span id="package-exports"></span>
</div>
