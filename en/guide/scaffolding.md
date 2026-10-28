---
title: Scaffold a Service
description: Choose a starting project, inspect its generated files, and keep generation tied to your proto contracts.
docType: concept
outline: 2
---

# Scaffolding a New Service

Scaffolding writes the starting files. After that, they are your application —
not hidden framework configuration.

<figure class="technical-diagram guide-topic-diagram--wide" aria-label="Scaffold, inspect, then change your service">

```mermaid
flowchart TD
    accTitle: Scaffolding writes files that your application owns
    accDescr: Runtime, package manager and capability choices feed the builder or CLI. The resulting project contains editable proto contracts, handlers, server configuration and tests.
    Choices["Runtime · package manager<br/>capabilities"] --> Scaffold["Builder / CLI"]
    Scaffold --> Project["Your editable project"]
    Project --> Proto["Proto contracts"]
    Project --> Handlers["Handlers"]
    Project --> Server["Server config"]
    Project --> Tests["Tests"]
    class Project accent
```

<figcaption>Generated starting code remains ordinary, editable project code.</figcaption>
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
