---
title: '@connectum/events-redis'
description: Redis Streams and Valkey adapter with consumer groups and explicit stream controls.
docType: package-hub
---

# @connectum/events-redis

Redis Streams and Valkey adapter with consumer groups and explicit stream controls.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/events-redis
~~~
== pnpm
~~~bash
pnpm add @connectum/events-redis
~~~
== bun
~~~bash
bun add @connectum/events-redis
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { RedisAdapter } from '@connectum/events-redis';

const adapter = RedisAdapter({
  url: 'redis://localhost:6379',
});
~~~

## Redis Protocol {#redis-protocol}

The adapter connects with RESP2 by default, so upgrading `ioredis` does not
change the wire protocol of an existing application. To use RESP3, set
`protocol: 3` in `redisOptions`:

~~~typescript
import { RedisAdapter } from '@connectum/events-redis';

const adapter = RedisAdapter({
  url: 'redis://localhost:6379',
  redisOptions: {
    protocol: 3,
    replyMapping: 'resp3', // Optional; omit it to keep the ioredis default, 'legacy'
  },
});
~~~

`replyMapping` chooses how `ioredis` returns RESP3 map replies: `'legacy'` as
flat arrays, `'resp3'` as plain objects. The adapter reads stream replies in
either shape. `replyMapping: 'resp3'` requires `protocol: 3`: with RESP2,
explicit or default, `RedisAdapter()` throws a `TypeError` when it is called,
before opening any connection. The dedicated blocking connections used for
`XREADGROUP` are duplicates of the main connection and use the same protocol
and reply mapping. RESP3 support is available since 1.3.0.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `RedisAdapter` | Connect EventBus to Redis Streams or Valkey. |
| `RedisAdapterOptions` | Configure connection, broker, and stream behavior. |

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/events/adapters)
- **Configure:** [Task and configuration guidance](/en/guide/events/adapters)
- **API reference:** [Exact options and symbols](/en/api/@connectum/events-redis/types/interfaces/RedisAdapterOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/events-redis/)
- **Source:** [@connectum/events-redis on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/events-redis)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="redisadapteroptions"></span>
<span id="redisbrokeroptions"></span>
<span id="connection-modes"></span>
<span id="redis-streams-concepts"></span>
<span id="stream-keys"></span>
<span id="consumer-groups"></span>
<span id="message-acknowledgment"></span>
<span id="blocking-connections"></span>
<span id="valkey-compatibility"></span>
<span id="configuration"></span>
<span id="stream-trimming"></span>
<span id="tuning-consumption"></span>
<span id="event-metadata"></span>
<span id="exports-summary"></span>
</div>
