[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RawSubscribeOptions

# Interface: RawSubscribeOptions

Defined in: [packages/events/src/types.ts:51](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L51)

Options for raw subscribe

## Properties

### group?

> `optional` **group?**: `string`

Defined in: [packages/events/src/types.ts:61](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L61)

Consumer group name for load-balanced consumption.

Without it the adapter picks a new random group for every subscription.
With Kafka and Redis Streams that group has no committed position, so a
restarted process starts at the end of the stream and never sees the events
published while it was down; give the subscription an explicit `group` to
keep its position across restarts.
