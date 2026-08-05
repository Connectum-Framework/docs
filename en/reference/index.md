---
title: API and Reference
description: Find Connectum modules, exact API symbols, compatibility information, and migration guidance.
docType: reference-landing
---

<script setup>
import ModuleGrid from '../../.vitepress/theme/components/ModuleGrid.vue'
import site from '../../.vitepress/data/site.json'
</script>

# API and Reference

Reference documentation currently describes the **{{ site.documentedVersion }}**
release line. Historical version switching is not available yet; compare this
line with the versions installed in your application before applying an option
or migration.

## Find the right surface

<div class="reference-routes">
    <a href="/en/api/">
        <strong>Exact API symbols</strong>
        <span>Generated TypeDoc for functions, interfaces, types, fields, and defaults.</span>
    </a>
    <a href="/en/packages/">
        <strong>Module selection</strong>
        <span>Purpose, installation, key entry points, and learning routes for every package.</span>
    </a>
    <a href="/en/guide/runtime-compatibility">
        <strong>Runtime compatibility</strong>
        <span>Canonical Node.js and Bun support matrix, limitations, and verification status.</span>
    </a>
    <a href="/en/migration/">
        <strong>Migration</strong>
        <span>Required upgrade actions, applicability, and links to release history.</span>
    </a>
</div>

## Common exact lookups

- [`CreateServerOptions`](/en/api/@connectum/core/types/interfaces/CreateServerOptions)
- [`JwtAuthInterceptorOptions`](/en/api/@connectum/auth/interfaces/JwtAuthInterceptorOptions)
- [`DefaultInterceptorOptions`](/en/api/@connectum/interceptors/defaults/interfaces/DefaultInterceptorOptions)
- [`EventBusOptions`](/en/api/@connectum/events/types/interfaces/EventBusOptions)
- [`OtelInterceptorOptions`](/en/api/@connectum/otel/interfaces/OtelInterceptorOptions)

## Browse by module

<ModuleGrid />
