[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeAmqpAdapter

# Function: FakeAmqpAdapter()

> **FakeAmqpAdapter**(`options?`): [`FakeAmqpAdapterInstance`](../interfaces/FakeAmqpAdapterInstance.md)

Defined in: [packages/events-amqp/src/testing.ts:192](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L192)

Create a programmable AMQP adapter test double.

## Parameters

### options?

[`FakeAmqpAdapterOptions`](../interfaces/FakeAmqpAdapterOptions.md) = `{}`

## Returns

[`FakeAmqpAdapterInstance`](../interfaces/FakeAmqpAdapterInstance.md)

## Example

```typescript
import { FakeAmqpAdapter } from '@connectum/events-amqp/testing';
import { AmqpPublishTimeoutError } from '@connectum/events-amqp';

const fake = FakeAmqpAdapter();
const bus = createEventBus({ adapter: fake, routes: [eventRoutes] });
await bus.start();

// The state-UNKNOWN outcome, untestable against a real broker:
fake.control.nextPublish(new AmqpPublishTimeoutError('no outcome (UNKNOWN)'));
await assert.rejects(() => bus.publish(OrderSchema, order), AmqpPublishTimeoutError);

fake.control.dropConnection();          // disconnected → reconnecting
fake.control.completeRecovery();        // connected { reconnected: true }
```
