[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / matchPattern

# Function: matchPattern()

> **matchPattern**(`pattern`, `topic`): `boolean`

Defined in: [wildcard.ts:27](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/wildcard.ts#L27)

Match a topic against a wildcard pattern.

## Parameters

### pattern

`string`

Pattern with optional `*` and `>` wildcards

### topic

`string`

Concrete topic name to match

## Returns

`boolean`

true if the topic matches the pattern

## Example

```typescript
matchPattern("user.*", "user.created")         // true
matchPattern("user.*", "user.created.v2")      // false
matchPattern("user.>", "user.created")         // true
matchPattern("user.>", "user.created.v2")      // true
matchPattern("user.created", "user.created")   // true
```
