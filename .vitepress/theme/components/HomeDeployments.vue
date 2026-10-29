<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { data } from '../../homepage/showcase.data.ts';

const section = ref<HTMLElement>();
const phase = ref<'static' | 'loading' | 'ready' | 'error'>('static');
let active = true;
let dispose: (() => void) | undefined;

async function load() {
    if (phase.value === 'loading' || phase.value === 'ready') return;
    phase.value = 'loading';
    try {
        const runtime = await import('../../homepage/players.ts');
        if (!active || !section.value) return;
        dispose = runtime.mountDeployment(section.value);
        phase.value = 'ready';
    } catch {
        if (active) phase.value = 'error';
    }
}

onMounted(load);
onBeforeUnmount(() => {
    active = false;
    dispose?.();
});
</script>

<template>
    <section id="service-calls" ref="section" class="home-section home-deployments" :data-phase="phase" aria-labelledby="service-calls-title" v-html="data.deployment" />
    <p v-if="phase === 'error'" class="home-animation-failure" role="status">
        Animation unavailable. The static deployment remains readable. <button type="button" @click="load">Retry animation</button>
    </p>
</template>

<style src="../../homepage/deployment.css" />
