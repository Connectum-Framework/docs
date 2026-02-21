[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / ErrorHandlerOptions

# Interface: ErrorHandlerOptions

Defined in: [types.ts:21](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L21)

Error handler interceptor options

## Properties

### includeStackTrace?

> `optional` **includeStackTrace**: `boolean`

Defined in: [types.ts:33](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L33)

Include stack trace in logs

#### Default

```ts
process.env.NODE_ENV !== "production"
```

***

### ~~logErrors?~~

> `optional` **logErrors**: `boolean`

Defined in: [types.ts:27](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L27)

Log errors to console.

#### Default

```ts
process.env.NODE_ENV !== "production"
```

#### Deprecated

Use onError callback instead

***

### onError()?

> `optional` **onError**: (`info`) => `void`

Defined in: [types.ts:39](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L39)

Callback for error logging. Replaces console.error when provided.
Receives rich error info including serverDetails from SanitizableError.

#### Parameters

##### info

###### code

`number`

###### error

`Error`

###### serverDetails?

`Readonly`\<`Record`\<`string`, `unknown`\>\>

###### stack?

`string`

#### Returns

`void`
