<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

const props = defineProps<{ entries: readonly { id: string; title: string; to: string }[]; summary: string }>();

function followFragment() {
    const destination = props.entries.find((entry) => `#${entry.id}` === location.hash)?.to;
    if (!destination) return;
    const target = new URL(destination, location.origin);
    target.search = location.search;
    location.replace(target.href);
}

onMounted(() => {
    followFragment();
    window.addEventListener('hashchange', followFragment);
});
onBeforeUnmount(() => window.removeEventListener('hashchange', followFragment));
</script>

<template>
    <details class="moved-guide-sections">
        <summary>{{ props.summary }}</summary>
        <ul>
            <li v-for="entry in props.entries" :id="entry.id" :key="entry.id"><a :href="entry.to">{{ entry.title }}</a></li>
        </ul>
    </details>
</template>
