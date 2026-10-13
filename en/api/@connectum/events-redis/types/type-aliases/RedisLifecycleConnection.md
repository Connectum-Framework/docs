[Connectum API Reference](../../../../index.md) / [@connectum/events-redis](../../index.md) / [types](../index.md) / RedisLifecycleConnection

# Type Alias: RedisLifecycleConnection

> **RedisLifecycleConnection** = `"publisher"` \| \{ `group`: `string`; `patterns`: readonly `string`[]; \}

Defined in: [types.ts:70](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L70)

Which client connection of the adapter an event concerns.

## Union Members

`"publisher"`

***

### Type Literal

\{ `group`: `string`; `patterns`: readonly `string`[]; \}

#### group

> `readonly` **group**: `string`

The dedicated blocking connection of one subscription.

#### patterns

> `readonly` **patterns**: readonly `string`[]
