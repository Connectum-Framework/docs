[Connectum API Reference](../../../index.md) / [@connectum/events-amqp](../index.md) / AmqpTopologyObject

# Type Alias: AmqpTopologyObject

> **AmqpTopologyObject** = \{ `kind`: `"exchange"` \| `"queue"`; `name`: `string`; \} \| \{ `destination`: `string`; `destinationType`: `"queue"` \| `"exchange"`; `kind`: `"binding"`; `routingKey`: `string`; `source`: `string`; \}

Defined in: [packages/events-amqp/src/errors.ts:75](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/errors.ts#L75)

Machine-readable identity of the topology object a declaration or
verification failed on. A binding has no name of its own — it is identified
by its endpoints and routing key — hence the discriminated shape.
