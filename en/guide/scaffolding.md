---
title: Scaffold a service
description: Create a runnable Connectum project with the CLI, then take ownership of its files.
docType: concept
outline: 2
---

# Scaffold a service {#scaffolding-a-new-service}

`connectum init` creates a runnable project with a sample service, health checks
and reflection. The generated files are your application: edit its contract,
write handlers and configure the capabilities you select.

```bash
npx @connectum/cli init my-service --yes
cd my-service
pnpm install
pnpm start
```

Run `init` without `--yes` to choose runtime, package manager and modules
interactively. The default project uses pnpm and direct Node.js TypeScript
execution; check [runtime requirements](/en/guide/runtime-compatibility).
The CLI fetches its pinned example base from GitHub, so the first run needs
network access.

Use [Builder](/en/builder) to inspect the selected project before downloading it,
or follow [Quickstart](/en/guide/quickstart) to add a protected Page RPC.

The [scaffold structure and CLI guide](/en/guide/scaffolding-commands) in
Build a service explains generated files, module composition, command options,
service generation and proto synchronization. The
[manual tutorial](/en/guide/quickstart-manual) builds the foundation without `init`.

<GuideSections route="/en/guide/scaffolding" />
