[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / SubscriptionPatternRule

# Type Alias: SubscriptionPatternRule

> **SubscriptionPatternRule** = `"no-empty-segment"` \| `"kafka-topic-name"`

Defined in: [packages/events/src/subscriptionPatterns.ts:16](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/subscriptionPatterns.ts#L16)

What a rule refuses:

- `"no-empty-segment"` -- any pattern with an empty dot-separated segment (the empty string,
  `a..b`, `.a`, `a.`, `.`). For brokers whose subject syntax has no empty token (NATS) and for
  the in-memory adapter, which matches the same way.
- `"kafka-topic-name"` -- only the names Kafka reserves: the empty string, `.` and `..`. Every
  other name with an empty segment (`a..b`, `.a`, `a.`) is a legal Kafka topic.
