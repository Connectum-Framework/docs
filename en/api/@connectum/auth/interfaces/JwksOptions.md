[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / JwksOptions

# Interface: JwksOptions

Defined in: [packages/auth/src/types.ts:195](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L195)

Refresh and timeout settings of the remote key set behind `jwksUri`.

Each value is handed to `createRemoteJWKSet` of jose; an omitted one keeps jose's own default,
which is listed with it. All durations are in milliseconds.

## Properties

### cacheMaxAge?

> `readonly` `optional` **cacheMaxAge?**: `number`

Defined in: [packages/auth/src/types.ts:214](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L214)

Longest time the cached key set is used before it is fetched again. A key removed from the
identity provider can keep verifying until the next fetch, at the latest until the cache expires (a
fetch caused by an unknown key after the cooldown replaces the cache earlier). A number, 0 or more; `0` fetches the
key set for every request (the cache never serves), and `Infinity` never expires the cache (a
missing key still triggers a fetch once the cooldown has passed).

#### Default

```ts
600000
```

***

### cooldownDuration?

> `readonly` `optional` **cooldownDuration?**: `number`

Defined in: [packages/auth/src/types.ts:205](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L205)

Time after a successful fetch during which a token signed with a key that is not in the cached
key set does NOT trigger another fetch. Such a token ends with `Unauthenticated` for this long
after a key rotation, and a retired key can keep verifying from the cache until the next fetch. An upper
bound, not a fixed period: a cache older than `cacheMaxAge` is fetched again earlier. A finite number, 0 or more;
`0` fetches again on every unknown key (a stream of tokens with unknown keys then turns into a
stream of requests to the identity provider).

#### Default

```ts
30000
```

***

### timeoutDuration?

> `readonly` `optional` **timeoutDuration?**: `number`

Defined in: [packages/auth/src/types.ts:220](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L220)

Time after which a request for the key set is aborted. Every request that needs the fetch ends
with `Unauthenticated` when it expires. A whole number from 1 to 2147483647 (the longest Node.js timer).

#### Default

```ts
5000
```
