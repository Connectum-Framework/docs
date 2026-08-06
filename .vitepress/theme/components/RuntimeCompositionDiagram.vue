<script setup lang="ts">
import runtimeCompositionSvg from '../assets/diagrams/runtime-composition.svg?raw';
</script>

<template>
    <figure class="technical-diagram">
        <div class="technical-diagram__art" v-html="runtimeCompositionSvg" />
        <figcaption>
            The solid route is the shared inbound RPC path. Dashed routes are explicit integrations: protocol
            registration and OpenTelemetry instrumentation. Brokers and telemetry sinks remain outside the service
            process.
        </figcaption>
    </figure>
</template>
