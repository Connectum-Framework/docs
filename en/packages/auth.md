---
title: '@connectum/auth'
description: Authentication, authorization, trusted gateway and internal identity, auth context, and client credentials.
docType: package-hub
---

# @connectum/auth

Authentication, authorization, trusted gateway and internal identity, auth context, and client credentials.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/auth
~~~
== pnpm
~~~bash
pnpm add @connectum/auth
~~~
== bun
~~~bash
bun add @connectum/auth
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { createJwtAuthInterceptor } from '@connectum/auth';

const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://id.example.com/.well-known/jwks.json',
  issuer: 'https://id.example.com/',
  audience: 'orders-api',
});
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `createJwtAuthInterceptor` | Verify bearer tokens with JWKS, public keys, or a shared secret. |
| `createAuthzInterceptor` | Apply explicit allow and deny rules. |
| `requireAuthContext` | Read the verified identity in a handler. |

Architecture-layer and dependency details remain in the [Architecture Overview](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/auth)
- **Configure:** [Task and configuration guidance](/en/guide/auth/jwt)
- **API reference:** [Exact options and symbols](/en/api/@connectum/auth/interfaces/JwtAuthInterceptorOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/auth/)
- **Source:** [@connectum/auth on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/auth)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="auth-context"></span>
<span id="createauthinterceptoroptions"></span>
<span id="authinterceptoroptions"></span>
<span id="createjwtauthinterceptoroptions"></span>
<span id="jwtauthinterceptoroptions"></span>
<span id="creategatewayauthinterceptoroptions"></span>
<span id="gatewayauthinterceptoroptions"></span>
<span id="gatewayheadermapping"></span>
<span id="createsessionauthinterceptoroptions"></span>
<span id="sessionauthinterceptoroptions"></span>
<span id="createinternalauthinterceptoroptions"></span>
<span id="internalauthinterceptoroptions"></span>
<span id="meshidentitytrustoptions"></span>
<span id="meshidentityentry"></span>
<span id="signedtokentrustoptions"></span>
<span id="signedtokenissuer"></span>
<span id="sharedsecrettrustoptions"></span>
<span id="createauthzinterceptoroptions"></span>
<span id="authzinterceptoroptions"></span>
<span id="authzrule"></span>
<span id="proto-based-authorization"></span>
<span id="proto-definitions"></span>
<span id="usage-in-proto-files"></span>
<span id="createprotoauthzinterceptoroptions"></span>
<span id="protoauthzinterceptoroptions"></span>
<span id="resolvemethodauthmethod"></span>
<span id="getpublicmethodsservices"></span>
<span id="getinternalmethodsservices"></span>
<span id="client-side-interceptors"></span>
<span id="createclientbearerinterceptoroptions"></span>
<span id="clientbearerinterceptoroptions"></span>
<span id="createclientgatewayinterceptoroptions"></span>
<span id="clientgatewayinterceptoroptions"></span>
<span id="context-utilities"></span>
<span id="authcontextstorage"></span>
<span id="getauthcontext"></span>
<span id="requireauthcontext"></span>
<span id="header-utilities"></span>
<span id="setauthheadersheaders-context-propagatedclaims"></span>
<span id="parseauthheadersheaders"></span>
<span id="authheaders"></span>
<span id="cache"></span>
<span id="lrucachet"></span>
<span id="cacheoptions"></span>
<span id="errors"></span>
<span id="authzdeniederror"></span>
<span id="method-pattern-matching"></span>
<span id="matchesmethodpatternservicename-methodname-patterns"></span>
<span id="testing-utilities"></span>
<span id="rs256-jwks-test-helpers"></span>
<span id="security-considerations"></span>
<span id="exports-summary"></span>
</div>
