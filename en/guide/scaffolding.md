---
title: Scaffold a Service
description: Choose a starting project, inspect its generated files, and keep generation tied to your proto contracts.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../.vitepress/theme/assets/diagrams/guide/scaffolding.html?raw';
</script>

# Scaffolding a New Service

Scaffolding writes the starting files. After that, they are your application —
not hidden framework configuration.

<figure class="technical-diagram" data-guide-overview="scaffolding" aria-label="Scaffolding commands and owned files">
<GuideOverview :source="overview" />
<figcaption>The builder previews a pinned generator; documented 1.3 options and descriptor exports are not available in npm 1.2.x. Optional modules still need their broker, auth configuration and telemetry backend.</figcaption>
</figure>

## Start with the files

The [service builder](/en/builder) lets you inspect the project and download all
its files. It also shows what each selected capability changes.

Prefer to build everything yourself? Follow the
[manual first-service tutorial](/en/guide/quickstart-manual).

## Use the CLI deliberately

The [command guide](/en/guide/scaffolding-commands) keeps the full `init`,
`generate service` and `proto sync` instructions, naming rules and generated-file
behavior. Its **1.3** CLI options are not available from published **1.2.x**
packages until that release is published. The builder identifies its pinned
generator source; do not treat its preview command as proof of npm availability.

<GuideSections route="/en/guide/scaffolding" />
