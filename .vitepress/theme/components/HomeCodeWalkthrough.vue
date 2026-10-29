<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const panel = ref<HTMLElement>();
const phase = ref<'static' | 'loading' | 'ready' | 'error'>('static');
let active = true;
let dispose: (() => void) | undefined;

async function load() {
    if (phase.value === 'loading' || phase.value === 'ready') return;
    phase.value = 'loading';
    try {
        const runtime = await import('../../homepage/players.ts');
        if (!active || !panel.value) return;
        dispose = runtime.mountCode(panel.value);
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
    <div class="home-walkthrough">
        <section ref="panel" class="home-code" :data-phase="phase" aria-label="Proto-to-service code walkthrough">
            <div class="home-code__bar"><span></span><span></span><span></span><strong>server.ts</strong></div>
            <div class="home-code__highlight"><slot /></div>
        </section>
        <p v-if="phase === 'error'" class="home-animation-failure" role="status">
            Animation unavailable. The static contract remains readable. <button type="button" @click="load">Retry animation</button>
        </p>
    </div>
</template>

<style src="../../homepage/prototype.css" />
