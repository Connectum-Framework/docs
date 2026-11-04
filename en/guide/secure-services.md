---
title: Secure services
description: Configure caller identity, authorization and transport security as distinct boundaries.
docType: section
---

# Secure services

Authentication establishes who called; authorization decides what that caller
may do. Configure both before treating a protected method as accessible only
to its intended callers. Proto annotations do not verify an identity by themselves.

TLS protects traffic on a network connection. Mutual TLS also verifies peers at
that boundary; it does not replace application-level authorization. Request
admission controls which requests reach the normal RPC pipeline.

## Topics

<GuideSection section="secure-services" />
