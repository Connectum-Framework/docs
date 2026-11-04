<script setup lang="ts">
import { computed } from 'vue';
import { guideSections } from '../../guide/navigation.ts';

const props = defineProps<{ section: string }>();
// biome-ignore lint/correctness/noUnusedVariables: the Vue template consumes this binding; vue-tsc checks it.
const current = computed(() => {
    const entry = guideSections.find((entry) => entry.id === props.section);
    if (!entry) throw new Error(`Unknown Guide section: ${props.section}`);
    return entry;
});
</script>

<template>
    <nav class="guide-section-index" :aria-label="`${current.text} topics`">
        <ul>
            <li v-for="item in current.items" :key="item.link">
                <a :href="item.link">{{ item.text }}</a>
                <ul v-if="item.items">
                    <li v-for="child in item.items" :key="child.link"><a :href="child.link">{{ child.text }}</a></li>
                </ul>
            </li>
        </ul>
    </nav>
</template>
