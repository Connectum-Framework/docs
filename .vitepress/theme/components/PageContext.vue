<script setup lang="ts">
import { useRoute } from 'vitepress';
import { computed } from 'vue';
import { findModule } from '../../data/modules.ts';
// biome-ignore lint/correctness/noUnusedImports: the Vue template renders the documented version.
import site from '../../data/site.json';
import { sectionForRoute } from '../../guide/navigation.ts';

const route = useRoute();

// biome-ignore lint/correctness/noUnusedVariables: the Vue template renders the route context.
const context = computed(() => {
    const path = route.path;
    if (path === '/en/' || path === '/en/index.html') return null;

    const packageMatch = path.match(/^\/en\/api\/@connectum\/([^/]+)/);
    const module = packageMatch ? findModule(packageMatch[1]) : undefined;

    if (path.startsWith('/en/api/')) {
        return {
            section: 'API reference',
            sectionLink: '/en/api/',
            detail: module?.name ?? 'Generated TypeDoc',
            detailLink: module?.api,
        };
    }
    if (path.startsWith('/en/guide/')) {
        const section = sectionForRoute(path);
        return { section: section?.text ?? 'Guides', sectionLink: section?.link ?? '/en/guide/about', detail: undefined, detailLink: undefined };
    }
    if (path.startsWith('/en/migration/')) {
        return { section: 'Migration', sectionLink: '/en/migration/', detail: undefined, detailLink: undefined };
    }
    return null;
});
</script>

<template>
    <div v-if="context" class="page-context" aria-label="Page context">
        <a :href="context.sectionLink">{{ context.section }}</a>
        <span v-if="context.detail" aria-hidden="true">/</span>
        <a v-if="context.detail && context.detailLink" :href="context.detailLink">{{ context.detail }}</a>
        <span v-else-if="context.detail">{{ context.detail }}</span>
        <span class="page-context__version">Docs {{ site.documentedVersion }}</span>
    </div>
</template>
