import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import type { OverlayResult } from './runtime.ts';
import { type AnnotationId, initialSettings, type MethodId } from './settings.ts';

type Runtime = typeof import('./runtime.ts');
type Highlight = typeof import('./highlight.ts');

export function useOpenapiDemo(initial: OverlayResult, initialOutput: string, initialFull: string) {
    const annotation = ref<AnnotationId>(initialSettings.annotation);
    const method = ref<MethodId>(initialSettings.method);
    const phase = ref<'static' | 'loading' | 'running' | 'ready' | 'error'>('static');
    const result = shallowRef<OverlayResult | undefined>(initial);
    const output = ref(initialOutput);
    const fullOutput = ref(initialFull);
    const error = ref('');
    let modules: Promise<[Runtime, Highlight]> | undefined;
    let mounted = false;
    let active = true;
    let generation = 0;
    const enabled = computed(() => phase.value !== 'static' && phase.value !== 'loading');

    async function run() {
        if (!mounted) return;
        const current = ++generation;
        const settings = { annotation: annotation.value, method: method.value };
        phase.value = modules ? 'running' : 'loading';
        result.value = undefined;
        output.value = '';
        fullOutput.value = '';
        error.value = '';
        try {
            modules ??= Promise.all([import('./runtime.ts'), import('./highlight.ts')]);
            const [runtime, highlight] = await modules;
            if (!active || current !== generation) return;
            const next = runtime.runOverlay(settings);
            const rendered = next.kind === 'rejected' ? ['', ''] : await Promise.all([highlight.renderOutput(next.output), highlight.renderOutput(next.fullOutput)]);
            if (!active || current !== generation) return;
            result.value = next;
            [output.value, fullOutput.value] = rendered;
            phase.value = 'ready';
        } catch {
            if (!active || current !== generation) return;
            modules = undefined;
            phase.value = 'error';
            error.value = 'The local overlay could not run. Retry to load its runtime again.';
        }
    }

    function reset() {
        const unchanged = annotation.value === initialSettings.annotation && method.value === initialSettings.method;
        annotation.value = initialSettings.annotation;
        method.value = initialSettings.method;
        if (unchanged) void run();
    }

    watch([annotation, method], run, { flush: 'sync' });
    onMounted(() => {
        mounted = true;
        void run();
    });
    onBeforeUnmount(() => {
        active = false;
        generation++;
    });
    return { annotation, method, phase, result, output, fullOutput, error, enabled, reset, retry: run };
}
