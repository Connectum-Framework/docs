<script setup lang="ts">
import { onMounted } from 'vue';
import { findRedirect, redirectTarget } from '../../data/redirects.ts';

const props = defineProps<{ from: string }>();
const entry = findRedirect(props.from);
if (!entry) throw new Error(`Missing documentation redirect: ${props.from}`);

onMounted(() => {
    const target = new URL(redirectTarget(entry, location.hash), location.origin);
    target.search = location.search;
    location.replace(target.href);
});
</script>

<template>
    <div class="compatibility-route">
        <p>This page moved. <a :href="entry.to">Continue to the canonical documentation.</a></p>
        <details v-if="entry.fragments && Object.keys(entry.fragments).length">
            <summary>Find a previously linked section</summary>
            <ul>
                <li v-for="(target, fragment) in entry.fragments" :id="fragment" :key="fragment"><a :href="target">{{ fragment.replaceAll('-', ' ') }}</a></li>
            </ul>
        </details>
    </div>
</template>
