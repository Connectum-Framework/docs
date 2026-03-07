[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / parseServiceFromUrl

# Function: parseServiceFromUrl()

> **parseServiceFromUrl**(`url`, `host`): `string` \| `undefined`

Defined in: [httpHandler.ts:111](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/healthcheck/src/httpHandler.ts#L111)

Parse service name from URL query string

## Parameters

### url

`string` | `undefined`

### host

`string` | `undefined`

## Returns

`string` \| `undefined`

## Example

```typescript
parseServiceFromUrl('/healthz?service=my.service.v1.MyService', req.headers.host)
// returns 'my.service.v1.MyService'
```
