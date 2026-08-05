<script setup lang="ts">
import { computed } from 'vue';
import { moduleCategories, publicModules, type ModuleCategory } from '../../data/modules.ts';

const props = withDefaults(defineProps<{
    categories?: readonly ModuleCategory[];
    showApi?: boolean;
}>(), {
    categories: () => moduleCategories,
    showApi: true,
});

const groups = computed(() => props.categories.map((category) => ({
    category,
    modules: publicModules.filter((module) => module.category === category),
})));
</script>

<template>
    <div class="module-groups">
        <section v-for="group in groups" :key="group.category" class="module-group">
            <h2>{{ group.category }}</h2>
            <div class="module-grid">
                <article v-for="module in group.modules" :key="module.slug" class="module-card">
                    <p class="module-card__eyebrow">{{ module.category }}</p>
                    <h3><a :href="module.hub">{{ module.name }}</a></h3>
                    <p>{{ module.summary }}</p>
                    <p class="module-card__symbols">{{ module.entryPoints.join(' · ') }}</p>
                    <div class="module-card__links">
                        <a :href="module.guide">Learn</a>
                        <a :href="module.hub">Module</a>
                        <a v-if="showApi" :href="module.api">API</a>
                    </div>
                </article>
            </div>
        </section>
    </div>
</template>
