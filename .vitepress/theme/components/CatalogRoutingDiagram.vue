<script setup lang="ts">
import catalogRoutingSvg from '../assets/diagrams/catalog-routing.svg?raw';
</script>

<template>
    <figure class="technical-diagram">
        <div class="technical-diagram__art" v-html="catalogRoutingSvg" />
        <figcaption>
            <code>CatalogDispatcher</code> selects the transport; it does not select a different handler contract.
            Both the in-process <code>createRouterTransport()</code> path and the remote
            <code>connectNodeAdapter()</code> path apply the target server's routes and server interceptors before the
            handler. Stacked cards represent additional registered service <code>typeName</code> values; response
            arrows are omitted for legibility.
        </figcaption>
    </figure>
</template>
