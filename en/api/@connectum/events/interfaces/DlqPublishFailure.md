[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / DlqPublishFailure

# Interface: DlqPublishFailure

Defined in: [packages/events/src/middleware/dlq.ts:19](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/middleware/dlq.ts#L19)

What a failed dead-letter publish reports: the dead-letter topic, the event that could not be
copied there (its original topic and id) and the error of the publish.

## Properties

### error

> `readonly` **error**: `unknown`

Defined in: [packages/events/src/middleware/dlq.ts:23](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/middleware/dlq.ts#L23)

***

### eventId

> `readonly` **eventId**: `string`

Defined in: [packages/events/src/middleware/dlq.ts:22](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/middleware/dlq.ts#L22)

***

### eventType

> `readonly` **eventType**: `string`

Defined in: [packages/events/src/middleware/dlq.ts:21](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/middleware/dlq.ts#L21)

***

### topic

> `readonly` **topic**: `string`

Defined in: [packages/events/src/middleware/dlq.ts:20](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/middleware/dlq.ts#L20)
