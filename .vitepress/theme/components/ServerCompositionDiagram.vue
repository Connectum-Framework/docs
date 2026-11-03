<script setup lang="ts">
import source from '../assets/diagrams/server-composition.html?raw';

const svg = source.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
if (!svg) throw new Error('Server composition source must contain an inline SVG');
</script>

<template>
    <!-- biome-ignore lint/a11y/noNoninteractiveTabindex: the overflow region needs keyboard scrolling without JavaScript. -->
    <section class="technical-diagram__art server-composition-art" tabindex="0" aria-label="Server composition diagram; scroll horizontally" v-html="svg" />
</template>

<style>
.vp-doc .server-composition-art svg {
    min-width: 688px;
}

.vp-doc .technical-diagram__art.server-composition-art:hover {
    opacity: 1;
}

@media print {
    .vp-doc .technical-diagram__art.server-composition-art {
        overflow-x: visible;
    }

    .vp-doc .server-composition-art svg {
        min-width: 0;
    }
}
</style>
