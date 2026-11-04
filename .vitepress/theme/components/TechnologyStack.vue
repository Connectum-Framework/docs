<script setup lang="ts">
import { onContentUpdated } from 'vitepress';
import { ref } from 'vue';
import source from '../assets/diagrams/technology-stack.html?raw';
import { useStackParallax } from '../useStackParallax.ts';

// the standalone and embedded views share this checked-in figure; its scoped styles also survive SSR.
const figure = source.match(/<figure\b[\s\S]*?<\/figure>/)?.[0];
if (!figure) throw new Error('Technology stack source must contain a static figure');

const root = ref<HTMLElement>();
// biome-ignore lint/correctness/noUnusedVariables: Vue uses disabledReason in the note; vue-tsc checks template bindings.
const { disabledReason, refresh } = useStackParallax(root);
onContentUpdated(refresh);
</script>

<template>
    <div ref="root" class="technology-stack-embed" v-html="figure" />
    <p v-if="disabledReason" class="stack-motion-note">
        {{ disabledReason === 'reduced' ? 'Motion is off because your system requests reduced motion.' : 'Motion is disabled by the ?motion=static setting in this link.' }}
    </p>
</template>

<style>
@media screen and (prefers-reduced-motion: no-preference) {
    .technology-stack-embed[data-parallax] .stack-block svg {
        transform: translateY(var(--stack-parallax-y, 0px));
    }
}

.vp-doc .stack-motion-note {
    margin: -24px 0 32px;
    color: var(--vp-c-text-2);
    font-size: 14px;
}

@media print {
    .stack-motion-note {
        display: none;
    }
}

html[data-motion='static'] .technology-stack-embed .stack-block svg {
    transform: none;
}
</style>
