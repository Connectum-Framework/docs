<!-- biome-ignore-all lint/a11y/noNoninteractiveTabindex: overflow must remain keyboard-scrollable without JavaScript. -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ source: string }>();
const artwork = computed(() => {
    // only checked-in HTML enters this component; raw SVG keeps the no-JS frame intact.
    const svg = props.source.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
    const width = svg?.match(/viewBox="0 0 (\d+) \d+"/)?.[1];
    if (!svg || !width) throw new Error('A Guide overview needs an inline SVG and a native-width viewBox');
    return { svg, width };
});
</script>

<template>
    <section
        class="technical-diagram__art guide-overview-art"
        tabindex="0"
        aria-label="Section overview; scroll horizontally"
        :style="{ '--guide-overview-width': `${artwork.width}px` }"
        v-html="artwork.svg"
    />
</template>

<style>
.vp-doc .guide-overview-art svg {
    min-width: var(--guide-overview-width);
}

.vp-doc .technical-diagram__art.guide-overview-art:hover {
    opacity: 1;
}

@media print {
    .vp-doc .technical-diagram__art.guide-overview-art {
        overflow-x: visible;
    }

    .vp-doc .guide-overview-art svg {
        min-width: 0;
    }
}
</style>
