[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / assertPublishTopic

# Function: assertPublishTopic()

> **assertPublishTopic**(`options`): `void`

Defined in: [packages/events/src/subscriptionPatterns.ts:91](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/subscriptionPatterns.ts#L91)

Reject a topic the adapter's broker cannot serve, before the adapter publishes anything.

The publishing twin of [assertSubscriptionPatterns](assertSubscriptionPatterns.md), with the same two rules. Adapters call
it at the start of `publish()`: without it NATS answers a malformed subject with
`jetstream is not enabled`, Kafka answers its reserved names with an error that does not name the
topic, and the in-memory adapter delivers the event to wildcard subscribers although no
subscription pattern could ever name that topic. Adapters whose broker accepts any key (Redis,
RabbitMQ) do not call it.

## Parameters

### options

#### adapter

`string`

The adapter name used in the message

#### rule?

[`SubscriptionPatternRule`](../type-aliases/SubscriptionPatternRule.md)

What to refuse; `"no-empty-segment"` when omitted

#### topic

`string`

The topic the event is published to

## Returns

`void`

## Throws

When the topic is refused; the message names the adapter and the topic.

## Example

```typescript
assertPublishTopic({ adapter: "MyAdapter", topic: "user.created" }); // returns
assertPublishTopic({ adapter: "MyAdapter", topic: "user..created" }); // throws TypeError
assertPublishTopic({ adapter: "MyAdapter", topic: "user..created", rule: "kafka-topic-name" }); // returns
```
