[Connectum API Reference](../../../../index.md) / [@connectum/events-redis](../../index.md) / [types](../index.md) / RedisBrokerOptions

# Interface: RedisBrokerOptions

Defined in: [types.ts:38](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-redis/src/types.ts#L38)

Redis Streams broker tuning options.

## Properties

### blockMs?

> `readonly` `optional` **blockMs?**: `number`

Defined in: [types.ts:56](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-redis/src/types.ts#L56)

Block timeout in milliseconds for XREADGROUP.

How long the consumer blocks waiting for new messages
before retrying the loop.

#### Default

```ts
5000
```

***

### count?

> `readonly` `optional` **count?**: `number`

Defined in: [types.ts:63](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-redis/src/types.ts#L63)

Number of messages to read per XREADGROUP call.

#### Default

```ts
10
```

***

### maxLen?

> `readonly` `optional` **maxLen?**: `number`

Defined in: [types.ts:46](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-redis/src/types.ts#L46)

Maximum stream length (MAXLEN approximate for XADD).

When set, older entries are trimmed on publish.

#### Default

```ts
undefined (no limit)
```
