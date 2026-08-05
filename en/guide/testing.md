---
title: Testing
description: Choose the smallest Connectum testing layer that proves the behavior you changed.
docType: concept
outline: deep
---

# Testing

Connectum supports two complementary testing layers. Use TypeScript tests for fast handler and transport feedback, then scenario tests for the deployed protocol boundary.

## Choose a layer

| Question | Recommended surface |
|---|---|
| Does a handler or interceptor return the expected value/error? | [`@connectum/testing`](/en/packages/testing) with an in-process server/client |
| Do service-catalog calls resolve without a network listener? | [In-process transport](/en/guide/production/in-process-transport) |
| Does a running service expose correct gRPC, Connect, health, auth, TLS, or streaming behavior? | [runn](/en/guide/testing/runn) |
| Do you need Go plugins or JUnit-oriented scenario output? | [scenarigo](/en/guide/testing/scenarigo) |

## Recommended path

1. Test handler and middleware decisions in process.
2. Start the real service with its generated proto contract.
3. Exercise one successful call and the important failure paths through `runn`.
4. Add deployment-specific probe or TLS scenarios only where that boundary matters.

Scenario tests catch serialization, validation, interceptor-order, reflection, and health-endpoint integration that isolated unit tests cannot. They should not repeat every business-rule case already covered in TypeScript.

See the complete [runn example suite](https://github.com/Connectum-Framework/examples/tree/main/runn) for the executable end-to-end shape. Exact testing helpers remain in the [`@connectum/testing` API](/en/api/@connectum/testing/); shared low-level fixtures are separated in [`@connectum/test-fixtures`](/en/packages/test-fixtures).
