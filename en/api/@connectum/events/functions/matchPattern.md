[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / matchPattern

# Function: matchPattern()

> **matchPattern**(`pattern`, `topic`): `boolean`

Defined in: [packages/events/src/wildcard.ts:27](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/wildcard.ts#L27)

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
