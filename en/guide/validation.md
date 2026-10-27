---
title: Validation
description: Keep request constraints in protobuf and reject invalid input before the handler runs.
docType: concept
outline: 2
---

# Validation

Inventory should receive a meaningful SKU, not an empty string. Put that rule
beside the field in your protobuf contract; the configured validation
interceptor checks it before the handler runs.

<GuideFlow scene="validation">
<figure class="guide-map" aria-label="Validation before application work">
<ol>
<li><strong>Request</strong><small>A client sends a protobuf message.</small></li>
<li><strong>Check the rules</strong><small>The validation interceptor evaluates the generated constraints.</small></li>
<li><strong>Accept or reject</strong><small>Valid input reaches the handler. Invalid input returns INVALID_ARGUMENT.</small></li>
</ol>
<figcaption>A schema rule checks input shape. Stock availability remains a business decision in the handler.</figcaption>
</figure>
</GuideFlow>

## One rule

With `buf/validate/validate.proto` imported:

```proto
message CheckStockRequest {
  string sku = 1 [(buf.validate.field).string.min_len = 1];
}
```

Regenerate the descriptors after changing constraints.
`createDefaultInterceptors()` includes validation by default; the validation
dependencies still need to be installed. Defining the annotation alone does
not install middleware on a server.

## Go deeper

- [Set up validation and test an invalid request](/en/guide/validation-setup).
- [All constraint examples, error messages and business validation](/en/guide/validation-setup#proto-constraints).
- [Understand the interceptor chain](/en/guide/interceptors).

<GuideSections route="/en/guide/validation" />
