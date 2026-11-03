import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import type { RunResult, Settings } from './settings.ts';
import { initialSettings } from './settings.ts';

export function useInterceptorsDemo(initial: RunResult) {
    const chain = ref<Settings['chain']>(initialSettings.chain);
    const outcome = ref<Settings['outcome']>(initialSettings.outcome);
    const result = shallowRef<RunResult | undefined>(initial);
    const phase = ref<'static' | 'loading' | 'running' | 'ready' | 'error'>('static');
    const error = ref('');
    const enabled = ref(false);
    let runner: typeof import('./runtime.ts').runInterceptors | undefined;
    let controller: AbortController | undefined;
    let generation = 0;
    let active = true;

    async function run() {
        if (!runner) return;
        controller?.abort();
        controller = new AbortController();
        const current = ++generation;
        phase.value = 'running';
        result.value = undefined;
        error.value = '';
        try {
            const observed = await runner({ chain: chain.value, outcome: outcome.value }, controller.signal);
            // A superseded request must not overwrite the reader's newer selection.
            if (active && current === generation) {
                result.value = observed;
                phase.value = 'ready';
            }
        } catch {
            if (active && current === generation) {
                error.value = 'The local call could not run. Retry to get a result.';
                phase.value = 'error';
            }
        }
    }
    async function load() {
        phase.value = 'loading';
        error.value = '';
        try {
            const module = await import('./runtime.ts');
            if (!active) return;
            runner = module.runInterceptors;
            enabled.value = true;
            await run();
        } catch {
            if (active) {
                result.value = undefined;
                error.value = 'Could not load the interceptor runtime. Retry to enable the controls.';
                phase.value = 'error';
            }
        }
    }
    function reset() {
        chain.value = initialSettings.chain;
        outcome.value = initialSettings.outcome;
    }
    watch([chain, outcome], () => {
        if (enabled.value) void run();
    });
    onMounted(load);
    onBeforeUnmount(() => {
        active = false;
        generation++;
        controller?.abort();
    });
    return { chain, outcome, result, phase, error, enabled, reset, retry: () => (runner ? run() : load()) };
}
