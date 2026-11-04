---
title: Communication
description: Choose calls or events and connect services through local or remote transports.
docType: section
---

# Communication

Choose the interaction before choosing its transport. A call waits for an answer;
an event lets another service react later. Either can fail, and neither makes a
multi-service operation atomic.

For calls, the catalog describes contracts while local registration and remote
resolvers decide where those calls execute. In-process transport is the built-in
path for services mounted on the same server. Use the transport matrix to check
which network protocols and streaming shapes your deployment can expose.

Events adds a different boundary: the adapter, delivery policy and subscriber
determine when a reaction is accepted and what happens after a failure.

## Topics

<GuideSection section="communication" />
