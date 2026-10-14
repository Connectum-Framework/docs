[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / ErrorHandlerOptions

# Interface: ErrorHandlerOptions

Defined in: [types.ts:21](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L21)

Error handler interceptor options

## Properties

### exposeErrorMessages?

> `optional` **exposeErrorMessages?**: `boolean`

Defined in: [types.ts:64](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L64)

Send the text of a non-Connect failure to the client.

By default the text of an exception that is not a `ConnectError` or a
`SanitizableError` (an `Error`, a thrown string, an object with a numeric
`code`) never leaves the server: the client receives the fixed text
`"internal error"` for code `Internal`, and an empty text when the exception
carried its own numeric code. Such text routinely contains connection strings,
queries, file paths or values from the request (CWE-209).

The original is kept on the server in three places: as `cause` of the
thrown `ConnectError` (it is never serialized onto the wire), as
`info.error` of `onError` (original text, `cause`, code and stack), and in
the console log.

Set to `true` only when every caller is trusted (internal clients behind
a gateway) or while debugging: the original text then reaches the client
as it did before this option existed. The choice is server-side only; a
client cannot request it. It does not depend on `NODE_ENV`.
`ConnectError` and `SanitizableError` are not affected by this option.

#### Default

```ts
false
```

***

### includeStackTrace?

> `optional` **includeStackTrace?**: `boolean`

Defined in: [types.ts:33](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L33)

Include stack trace in logs

#### Default

```ts
process.env.NODE_ENV !== "production"
```

***

### ~~logErrors?~~

> `optional` **logErrors?**: `boolean`

Defined in: [types.ts:27](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L27)

Log errors to console.

#### Default

```ts
process.env.NODE_ENV !== "production"
```

#### Deprecated

Use onError callback instead

***

### onError?

> `optional` **onError?**: (`info`) => `void`

Defined in: [types.ts:39](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L39)

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
