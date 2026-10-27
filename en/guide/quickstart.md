---
title: Build Your First Connectum Service
description: Start with a protobuf contract, add a typed handler, and make one real RPC.
docType: concept
outline: 2
---

# Build Your First Connectum Service

One contract, one handler, one running service. You do not need a broker,
an identity provider or a telemetry backend to make your first call.

<figure class="guide-map" aria-label="From contract to a working RPC">
<ol>
<li><strong>Describe</strong><small>A .proto file names the method and its messages.</small></li>
<li><strong>Implement</strong><small>Generated types connect the contract to your TypeScript handler.</small></li>
<li><strong>Call</strong><small>Start the server, send a request, and read the response.</small></li>
</ol>
<figcaption>The first milestone is a real response, plus a rejected invalid request.</figcaption>
</figure>

## What you will build

A `GreeterService` accepts a name and returns a greeting:

```proto
service GreeterService {
  rpc SayHello(SayHelloRequest) returns (SayHelloResponse);
}
```

This is a contract excerpt. The tutorial supplies both messages, the handler,
server, generation configuration and commands.

## Choose how to start

- **Understand each file:** [Build the service step by step](/en/guide/quickstart-manual).
  Includes installation, Node.js/Bun commands, code generation, a real call,
  validation and troubleshooting.
- **Start from a generated project:** [Scaffold a service](/en/guide/scaffolding).
- **Explore the files first:** [Open the service builder](/en/builder).

Published packages require Node.js **≥22.13.0**. The tutorial's native Node.js
TypeScript path needs **≥25.2.0**; it also shows tsx and Bun alternatives.
See [runtime requirements and limits](/en/guide/runtime-compatibility).

<GuideSections route="/en/guide/quickstart" />
