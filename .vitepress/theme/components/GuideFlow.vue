<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { GUIDE_PAUSE_KEY, GUIDE_STEP_MS, type GuideScene, guideBeats, guideFrame } from '../../guide/motion.ts';

type Props = { scene: GuideScene };
const props: Props = defineProps<Props>();
const root = ref<HTMLDivElement>();
const elapsedMs = ref(0);
const paused = ref(false);
const hydrated = ref(false);
const reducedMotion = ref(true);
const inView = ref(false);
const pageVisible = ref(true);
const running = computed(() => hydrated.value && !paused.value && !reducedMotion.value && inView.value && pageVisible.value);
const frame = computed(() => guideFrame({ scene: props.scene, elapsedMs: elapsedMs.value }));
const beats = computed(() => guideBeats[props.scene]);
const playback = computed(() => (!hydrated.value || reducedMotion.value ? 'static' : paused.value ? 'paused' : running.value ? 'running' : 'waiting'));
let requestId: number | undefined;
let previousTime: number | undefined;
let observer: IntersectionObserver | undefined;
let media: MediaQueryList | undefined;

function stopClock() {
    if (requestId !== undefined) cancelAnimationFrame(requestId);
    requestId = undefined;
    previousTime = undefined;
}

function tick(time: number) {
    if (!running.value) return;
    if (previousTime !== undefined) elapsedMs.value += time - previousTime;
    previousTime = time;
    requestId = requestAnimationFrame(tick);
}

watch(running, (active) => {
    stopClock();
    if (active) requestId = requestAnimationFrame(tick);
});

function updateMotion() {
    reducedMotion.value = media?.matches ?? true;
}

function updateVisibility() {
    pageVisible.value = document.visibilityState === 'visible';
}

function togglePause() {
    paused.value = !paused.value;
    try {
        localStorage.setItem(GUIDE_PAUSE_KEY, String(paused.value));
    } catch {
        // a storage restriction must not prevent this diagram from being paused.
    }
}

onMounted(() => {
    try {
        paused.value = localStorage.getItem(GUIDE_PAUSE_KEY) === 'true';
    } catch {
        // the current page still has a working pause control without persistent storage.
    }
    media = window.matchMedia('(prefers-reduced-motion: reduce)');
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    observer = new IntersectionObserver(([entry]) => {
        inView.value = entry.isIntersecting;
    });
    if (root.value) observer.observe(root.value);
    hydrated.value = true;
});

onBeforeUnmount(() => {
    stopClock();
    observer?.disconnect();
    media?.removeEventListener('change', updateMotion);
    document.removeEventListener('visibilitychange', updateVisibility);
});
</script>

<template>
    <div
        ref="root"
        class="guide-flow"
        :class="{ 'guide-flow--motion': hydrated && !reducedMotion }"
        :data-scene="scene"
        :data-step="frame.index"
        :data-playback="playback"
        :style="{ '--guide-progress': frame.progress, '--guide-step-duration': `${GUIDE_STEP_MS}ms` }"
    >
        <slot />
        <section class="guide-flow-demo" aria-label="Illustrated sequence" aria-live="off">
            <div class="guide-flow-current">
                <span class="guide-flow-step">Illustrated step {{ frame.index + 1 }} of {{ beats.length }}</span>
                <p>{{ frame.beat.message }}</p>
                <code>{{ frame.beat.token }}</code>
            </div>
            <div class="guide-flow-progress" aria-hidden="true"><span></span></div>
            <div class="guide-flow-controls">
                <span>{{ playback === 'static' ? 'Static view' : playback === 'paused' ? 'Animation paused' : 'Automatic loop' }} · Illustration, not live execution.</span>
                <button v-if="hydrated && !reducedMotion" type="button" @click="togglePause">{{ paused ? 'Resume animation' : 'Pause animation' }}</button>
            </div>
            <details class="guide-flow-transcript">
                <summary>Read the illustrated sequence</summary>
                <ol>
                    <li v-for="beat in beats" :key="beat.token">
                        <p>{{ beat.message }}</p>
                        <code>{{ beat.token }}</code>
                    </li>
                </ol>
            </details>
        </section>
    </div>
</template>

<style src="../styles/guide-flow.css"></style>
