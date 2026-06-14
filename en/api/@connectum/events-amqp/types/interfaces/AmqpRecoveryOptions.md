[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpRecoveryOptions

# Interface: AmqpRecoveryOptions

Defined in: [packages/events-amqp/src/types.ts:209](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events-amqp/src/types.ts#L209)

Recovery knobs (passed through to amqplib's opt-in recovery).

## Properties

### factor?

> `readonly` `optional` **factor?**: `number`

Defined in: [packages/events-amqp/src/types.ts:215](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events-amqp/src/types.ts#L215)

#### Default

```ts
2
```

***

### initialDelay?

> `readonly` `optional` **initialDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:211](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events-amqp/src/types.ts#L211)

#### Default

```ts
100
```

***

### jitter?

> `readonly` `optional` **jitter?**: `number`

Defined in: [packages/events-amqp/src/types.ts:217](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events-amqp/src/types.ts#L217)

0..1

#### Default

```ts
0.2
```

***

### maxDelay?

> `readonly` `optional` **maxDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:213](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events-amqp/src/types.ts#L213)

#### Default

```ts
30000
```

***

### maxRetries?

> `readonly` `optional` **maxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:219](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events-amqp/src/types.ts#L219)

#### Default

```ts
Infinity
```
