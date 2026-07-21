[Connectum API Reference](../../../index.md) / [@connectum/events-amqp](../index.md) / testing

# testing

Programmable AMQP test double — the `@connectum/events-amqp/testing` subpath (#203).

`FakeAmqpAdapter` models the REAL adapter's observable contracts without a
broker and without importing `amqplib` at runtime:

- the typed error taxonomy (`AmqpConnectionError`, `AmqpTopologyError`, …) —
  inject outcomes per publish via [FakeAmqpControl.nextPublish](interfaces/FakeAmqpControl.md#nextpublish),
  including `AmqpPublishTimeoutError`: the state-UNKNOWN outcome that no
  real broker (or even Toxiproxy) reproduces deterministically;
- the canonical lifecycle union ([AmqpLifecycleCallbacks.onLifecycle](../types/interfaces/AmqpLifecycleCallbacks.md#onlifecycle))
  INCLUDING the deprecated flat-callback shim — events go through the real
  adapter's dispatch, so ordering, shim payloads, and exception isolation
  match the real adapter by construction;
- the state machine: `connect()` on a live or recovering (or dead
  retries-exhausted) adapter throws `already connected` like the real one;
  a mid-recovery `subscribe()` PARKS and settles with the recovery outcome;
  the probe-then-recover `connect()` semantics gate on `AmqpTopologyError`
  exactly like the real probe.

Deliberately NOT modeled (documented divergences):
- timing: there is no backoff — recovery advances only via explicit
  [FakeAmqpControl.completeRecovery](interfaces/FakeAmqpControl.md#completerecovery) / [FakeAmqpControl.exhaustRecovery](interfaces/FakeAmqpControl.md#exhaustrecovery)
  calls, and `reconnecting.delay` is always `0`;
- a queued topology `failSetup` at `connect()` WITHOUT fail-fast reports
  `setup-failed { initial: true }` and then connects anyway (the real
  adapter would keep retrying inside recovery); a NON-topology queued
  failure at `connect()` is consumed silently and the connect proceeds
  (the real adapter treats it as transient and blocks in recovery);
- broker-driven settlement: handler `ack`/`nack` calls are RECORDED (see
  the [FakeAmqpControl.deliver](interfaces/FakeAmqpControl.md#deliver) result) but do not drive redelivery —
  re-deliver explicitly with a higher `attempt` to model it. Handler
  rejections are swallowed exactly like the real consumer (which nacks for
  redelivery instead of propagating);
- the wire-level envelope: [FakeAmqpControl.published](interfaces/FakeAmqpControl.md#published) records the
  bus-facing call as the adapter received it. Wire fidelity is the real
  adapter's integration-tested domain. Incoming envelope headers ARE
  handled with parity: `deliver()` honors `x-event-id`/`x-published-at`
  and strips the internal keys from handler-visible metadata.

## Interfaces

- [FakeAmqpAdapterInstance](interfaces/FakeAmqpAdapterInstance.md)
- [FakeAmqpAdapterOptions](interfaces/FakeAmqpAdapterOptions.md)
- [FakeAmqpControl](interfaces/FakeAmqpControl.md)
- [FakeDeliveryResult](interfaces/FakeDeliveryResult.md)
- [FakePublishedRecord](interfaces/FakePublishedRecord.md)

## Type Aliases

- [FakePublishOutcome](type-aliases/FakePublishOutcome.md)

## Functions

- [FakeAmqpAdapter](functions/FakeAmqpAdapter.md)
