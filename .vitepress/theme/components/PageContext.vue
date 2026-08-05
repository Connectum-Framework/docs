<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import site from '../../data/site.json';
import { findModule } from '../../data/modules.ts';

const route = useRoute();

const context = computed(() => {
    const path = route.path;
    if (path === '/en/' || path === '/en/index.html') return null;

    const packageMatch = path.match(/^\/en\/(?:packages|api\/@connectum)\/([^/]+)/);
    const module = packageMatch ? findModule(packageMatch[1]) : undefined;

    if (path.startsWith('/en/api/')) {
        return {
            section: 'API reference',
            sectionLink: '/en/reference/',
            detail: module?.name ?? 'Generated TypeDoc',
            detailLink: module?.hub,
        };
    }
    if (path.startsWith('/en/packages/')) {
        return { section: 'Packages', sectionLink: '/en/packages/', detail: module?.category, detailLink: undefined };
    }
    if (path.startsWith('/en/guide/')) {
        return { section: 'Guides', sectionLink: '/en/guide/about', detail: undefined, detailLink: undefined };
    }
    if (path.startsWith('/en/migration/')) {
        return { section: 'Migration', sectionLink: '/en/migration/', detail: undefined, detailLink: undefined };
    }
    if (path.startsWith('/en/reference/')) {
        return { section: 'API & reference', sectionLink: '/en/reference/', detail: undefined, detailLink: undefined };
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
