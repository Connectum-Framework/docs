---
title: Build a service
description: Compose a Connectum application from its server, generated project and request middleware.
docType: section
---

# Build a service

After the [first working RPC](/en/guide/quickstart), configure the server that
will run your application. Register handlers and protocols, make startup and
shutdown explicit, then choose the middleware each request needs.

Start with Server for application composition. Scaffold structure and CLI
explains the files the generator hands over to you. Interceptors covers shared
request behavior; OpenAPI exposes your contract to HTTP tooling. Verify the
result through the separate [Testing](/en/guide/testing) section.

## Topics

<GuideSection section="build-a-service" />
