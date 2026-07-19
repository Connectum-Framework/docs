<script setup lang="ts">
/**
 * Navbar control that picks the runtime the documentation is written for.
 *
 * Which entry looks active is decided purely by CSS from `data-runtime` on `<html>`,
 * never by component state -- server-rendered and client-rendered markup are identical,
 * so there is no hydration mismatch and no flash of the wrong runtime.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';
import RuntimeIcon from './RuntimeIcon.vue';
import { RUNTIME_LABELS, RUNTIMES, type Runtime, setRuntime } from './runtime.ts';

const props = defineProps<{
    /** Rendered inside the mobile nav screen: a flat segmented control instead of a menu. */
    screen?: boolean;
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function choose(runtime: Runtime): void {
    setRuntime(runtime);
    open.value = false;
}

function onDocumentClick(event: MouseEvent): void {
    if (!open.value) return;
    if (root.value && !root.value.contains(event.target as Node)) open.value = false;
}

function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') open.value = false;
}

onMounted(() => {
    if (props.screen) return;
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
    <div v-if="screen" class="RuntimeSwitch runtime-switch-screen">
        <p class="runtime-switch-caption">Runtime</p>
        <div class="runtime-switch-segments">
            <button
                v-for="runtime in RUNTIMES"
                :key="runtime"
                type="button"
                class="runtime-switch-segment"
                :data-runtime-value="runtime"
                @click="choose(runtime)"
            >
                <RuntimeIcon :runtime="runtime" />
                <span>{{ RUNTIME_LABELS[runtime] }}</span>
            </button>
        </div>
    </div>

    <div v-else ref="root" class="RuntimeSwitch">
        <button
            type="button"
            class="runtime-switch-trigger"
            aria-haspopup="true"
            :aria-expanded="open"
            aria-label="Select the runtime used in code samples"
            @click="open = !open"
        >
            <span v-for="runtime in RUNTIMES" :key="runtime" class="runtime-switch-current" :data-runtime-value="runtime">
                <RuntimeIcon :runtime="runtime" />
                <span class="runtime-switch-name">{{ RUNTIME_LABELS[runtime] }}</span>
            </span>
            <span class="runtime-switch-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" /></svg>
            </span>
        </button>

        <div v-show="open" class="runtime-switch-menu">
            <button
                v-for="runtime in RUNTIMES"
                :key="runtime"
                type="button"
                class="runtime-switch-option"
                :data-runtime-value="runtime"
                @click="choose(runtime)"
            >
                <RuntimeIcon :runtime="runtime" />
                <span>{{ RUNTIME_LABELS[runtime] }}</span>
            </button>
            <p class="runtime-switch-note">
                Bun samples are verified on Bun 1.3.13; CI coverage is Node.js unless a page says otherwise.
                <a href="/en/guide/runtime-compatibility">Runtime compatibility</a>
            </p>
        </div>
    </div>
</template>
