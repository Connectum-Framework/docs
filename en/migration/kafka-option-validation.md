---
title: Kafka Adapter Validation
description: KafkaAdapter() rejects an invalid brokers list, clientId, sessionTimeout, retry and sasl.mechanism when it is called.
docType: migration
---

# Kafka Adapter Validation

> Applies to `@connectum/events-kafka` 1.3.0.

## Does this apply to you?

You need to act if `KafkaAdapter()` receives any of these, because it now throws when it is called instead of failing later:

- no options object (`KafkaAdapter(undefined)` used to throw `Cannot use 'in' operator` from inside the adapter);
- `brokers` that is not an array of non-empty strings, or is empty (`brokers: []` used to fail at `connect()`; `brokers: 'localhost:9092'` was accepted);
- a `clientId` that is an empty string;
- a `consumerOptions.sessionTimeout` that is not a finite number above 3000 ms (the client refused it at the first `subscribe()`);
- a `retry.retries` that is not a non-negative integer, or a `retry.maxRetryTime`, `initialRetryTime`, `factor` or `multiplier` that is negative or not finite;
- a `sasl.mechanism` outside `plain`, `scram-sha-256`, `scram-sha-512`, `oauthbearer` and `aws`.

If none of these applies, nothing changes for you. Valid values behave as before.

## Required changes

- Pass `brokers` as an array: `['kafka-1:9093', 'kafka-2:9093']`. A function that resolves the list is not part of the adapter's types and is no longer accepted.
- Remove an empty `clientId`, or give it a name. Without it the adapter uses the service identifier of the event bus, or `connectum`.
- Raise `consumerOptions.sessionTimeout` above 3000. Brokers also enforce their own minimum (`group.min.session.timeout.ms`, 6000 by default in Apache Kafka).
- Use one of the five SASL mechanisms in the typed `sasl` option. A mechanism that only the client library implements goes in `clientOptions.sasl`.

```typescript
// Before: accepted, failed at connect()
KafkaAdapter({ brokers: [] });

// After: throws RangeError "KafkaAdapter: brokers must contain at least one broker address"
KafkaAdapter({ brokers: ['kafka-1:9092'] });
```

## Behavior that changed without an option

- With `consumerOptions.allowAutoTopicCreation: true`, `subscribe()` waits up to ten seconds for the broker to create a missing topic. Without the option it rejects with an error that names the topic. See [topics that do not exist yet](/en/guide/events/adapters#kafka-missing-topics).
- Overlapping `connect()` calls share one attempt, and error messages for an unreachable `localhost` and for an invalid topic name now carry the reason and the topic. See [connection errors](/en/guide/events/adapters#kafka-connection-errors).

## Verify the upgrade

Create the adapter in a startup test: an invalid option throws at that call, before any connection is made.

## Related

- [Kafka or Redpanda adapter](/en/guide/events/adapters#kafka-adapter)
- [Kafka adapter options](/en/migration/kafka-adapter-options)
