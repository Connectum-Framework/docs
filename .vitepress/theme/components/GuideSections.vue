<script setup lang="ts">
import { onContentUpdated } from 'vitepress';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import sections from '../../guide/sections.json' with { type: 'json' };

const props = defineProps<{ route: string }>();
const links = computed(() => {
    const owner = sections.find((item) => item.route === props.route);
    return owner ? owner.anchors.slice(1).map((anchor) => ({ ...anchor, href: `${owner.detail}#${anchor.id}` })) : [];
});
const disclosure = ref<HTMLDetailsElement>();

// old fragments remain useful without forcing a reference-sized outline on a new reader.
function revealFragment() {
    let id: string;
    try {
        id = decodeURIComponent(location.hash.slice(1));
    } catch {
        return;
    }
    if (!links.value.some((anchor) => anchor.id === id) || !disclosure.value) return;
    disclosure.value.open = true;
    document.getElementById(id)?.scrollIntoView();
}

onContentUpdated(revealFragment);
onMounted(() => {
    revealFragment();
    window.addEventListener('hashchange', revealFragment);
});
onBeforeUnmount(() => window.removeEventListener('hashchange', revealFragment));
</script>

<template>
    <details v-if="links.length" ref="disclosure" class="guide-sections">
        <summary>Find a section from the full guide</summary>
        <p>The detailed material is preserved on a separate page. Earlier section links still work here.</p>
        <ul>
            <li v-for="section in links" :id="section.id" :key="section.id">
                <a :href="section.href">{{ section.title }}</a>
            </li>
        </ul>
    </details>
</template>
