[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / Telemetry

# Interface: Telemetry

Defined in: [testing/src/telemetry.ts:35](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/telemetry.ts#L35)

The collectors a scenario reads its telemetry from.

## Properties

### metrics

> **metrics**: [`InMemoryMetricCollector`](../classes/InMemoryMetricCollector.md)

Defined in: [testing/src/telemetry.ts:39](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/telemetry.ts#L39)

Receives every metric the code under test records during the scenario.

***

### spans

> **spans**: [`InMemorySpanCollector`](../classes/InMemorySpanCollector.md)

Defined in: [testing/src/telemetry.ts:37](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/telemetry.ts#L37)

Receives every span the code under test records during the scenario.
