---
title: Validation
description: Keep request constraints in protobuf and reject invalid input before the handler runs.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../.vitepress/theme/assets/diagrams/guide/validation.html?raw';
import ValidationShowcase from '../../.vitepress/theme/components/ValidationShowcase.vue';
</script>

# Validation

Inventory should receive a meaningful SKU, not an empty string. Put that rule
beside the field in your protobuf contract; the configured validation
interceptor checks it before the handler runs.

## One rule

With `buf/validate/validate.proto` imported:

<ValidationShowcase>
<template #contract>

```proto
message CheckStockRequest {
  string sku = 1 [
    (buf.validate.field).string = {
      min_len: 1
    }
  ];
}
```

</template>
</ValidationShowcase>

Regenerate the descriptors after changing constraints.
`createDefaultInterceptors()` includes validation by default; the validation
dependencies still need to be installed. Defining the annotation alone does
not install middleware on a server.

::: details How validation is wired
<figure class="technical-diagram" data-guide-overview="validation" aria-label="Validate structure before business work">
<GuideOverview :source="overview" />
<figcaption>Annotations require installed dependencies, regenerated descriptors and an active interceptor. Structural checks do not establish uniqueness, stock availability or a customer’s credit limit.</figcaption>
</figure>
:::

## Go deeper

- [Set up validation and test an invalid request](/en/guide/validation-setup).
- [All constraint examples, error messages and business validation](/en/guide/validation-setup#proto-constraints).
- [Understand the interceptor chain](/en/guide/interceptors).

<GuideSections route="/en/guide/validation" />
