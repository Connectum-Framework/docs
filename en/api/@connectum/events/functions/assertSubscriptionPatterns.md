[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / assertSubscriptionPatterns

# Function: assertSubscriptionPatterns()

> **assertSubscriptionPatterns**(`options`): `void`

Defined in: [packages/events/src/subscriptionPatterns.ts:62](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/subscriptionPatterns.ts#L62)

Reject subscription patterns that the adapter's broker cannot serve.

Adapters call this at the start of `subscribe()`, before they touch the broker, so a rejected
call leaves no consumer or consumer group behind. It checks every pattern, so a bad pattern next
to good ones rejects the whole call. The wildcards `*` and `>` are segments with content and are
never refused by either rule. Adapters whose broker accepts any key (Redis, RabbitMQ) do not
call it.

## Parameters

### options

#### adapter

`string`

The adapter name used in the message

#### patterns

readonly `string`[]

The patterns of the subscription

#### rule?

[`SubscriptionPatternRule`](../type-aliases/SubscriptionPatternRule.md)

What to refuse; `"no-empty-segment"` when omitted

## Returns

`void`

## Throws

For the first refused pattern; the message names the adapter and the pattern.

## Example

```typescript
assertSubscriptionPatterns({ adapter: "MyAdapter", patterns: ["user.created", "order.>"] }); // returns
assertSubscriptionPatterns({ adapter: "MyAdapter", patterns: ["user..created"] }); // throws TypeError
assertSubscriptionPatterns({ adapter: "MyAdapter", patterns: ["user..created"], rule: "kafka-topic-name" }); // returns
```
