[Connectum API Reference](../index.md) / AmqpAdapterOptions

# Interface: AmqpAdapterOptions

Defined in: [types.ts:10](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/types.ts#L10)

Options for creating an AMQP/RabbitMQ adapter.

## Properties

### consumerOptions?

> `readonly` `optional` **consumerOptions?**: [`AmqpConsumerOptions`](AmqpConsumerOptions.md)

Defined in: [types.ts:50](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/types.ts#L50)

Consumer options.

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [types.ts:28](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/types.ts#L28)

Exchange name for publishing and subscribing.

#### Default

```ts
"connectum.events"
```

***

### exchangeOptions?

> `readonly` `optional` **exchangeOptions?**: [`AmqpExchangeOptions`](AmqpExchangeOptions.md)

Defined in: [types.ts:40](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/types.ts#L40)

Exchange assertion options.

***

### exchangeType?

> `readonly` `optional` **exchangeType?**: `"topic"` \| `"direct"` \| `"fanout"` \| `"headers"`

Defined in: [types.ts:35](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/types.ts#L35)

Exchange type.

#### Default

```ts
"topic"
```

***

### publisherOptions?

> `readonly` `optional` **publisherOptions?**: [`AmqpPublisherOptions`](AmqpPublisherOptions.md)

Defined in: [types.ts:55](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/types.ts#L55)

Publisher options.

***

### queueOptions?

> `readonly` `optional` **queueOptions?**: [`AmqpQueueOptions`](AmqpQueueOptions.md)

Defined in: [types.ts:45](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/types.ts#L45)

Default queue assertion options.

***

### socketOptions?

> `readonly` `optional` **socketOptions?**: `Record`\<`string`, `unknown`\>

Defined in: [types.ts:21](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/types.ts#L21)

Socket options passed to `amqplib.connect()`.

***

### url

> `readonly` **url**: `string`

Defined in: [types.ts:16](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/types.ts#L16)

AMQP connection URL.

#### Example

```ts
"amqp://guest:guest@localhost:5672"
```
