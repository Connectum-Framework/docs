<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ASSEMBLY_PAUSE_KEY } from '../../catalog/assembly.ts';
import type { ValidationScenarioId } from '../../validation/scenarios.ts';
import { data } from '../../validation/showcase.data.ts';

const root = ref<HTMLElement>();
const selected = ref<ValidationScenarioId>(data.scenarios[0].id);
const source = ref<'proto' | 'handler'>('proto');
const scenario = computed(() => data.scenarios.find((entry) => entry.id === selected.value) ?? data.scenarios[0]);
const hydrated = ref(false);
const reducedMotion = ref(true);
const paused = ref(false);
const inView = ref(false);
const pageVisible = ref(true);
const replaying = ref(false);
const replayKey = ref(0);
const announcement = ref('');
const playback = computed(() =>
    !hydrated.value || reducedMotion.value ? 'static' : !replaying.value ? 'idle' : paused.value ? 'paused' : !inView.value || !pageVisible.value ? 'waiting' : 'running',
);
const trace = computed(() => [
    { name: 'Request', state: 'Received', detail: 'InventoryService / CheckStock', reached: true },
    { name: 'Proto validation', state: scenario.value.validation.passed ? 'Passed' : 'Rejected', detail: `sku · min_len: ${scenario.value.validation.minimum}`, reached: true },
    {
        name: 'Business handler',
        state: scenario.value.handlerCalls ? 'Called once' : 'Not reached',
        detail: scenario.value.handlerCalls ? 'Look up the SKU in the example inventory' : 'The invalid input never enters business logic',
        reached: scenario.value.handlerCalls > 0,
    },
]);
let media: MediaQueryList | undefined;
let observer: IntersectionObserver | undefined;

function select(id: ValidationScenarioId) {
    selected.value = id;
    replaying.value = false;
    const check = scenario.value.validation;
    announcement.value = `${scenario.value.label}: ${check.characters} characters, minimum ${check.minimum}. Validation ${check.passed ? 'passed' : 'failed'}. RPC ${scenario.value.code}. Handler calls: ${scenario.value.handlerCalls}.`;
}
function replay() {
    replayKey.value++;
    replaying.value = true;
    paused.value = false;
    savePause();
    announcement.value = `Replaying the recorded ${scenario.value.label.toLowerCase()} path.`;
}
function savePause() {
    try {
        // Share the existing reader preference without changing the accepted catalog.
        localStorage.setItem(ASSEMBLY_PAUSE_KEY, String(paused.value));
    } catch {
        announcement.value = 'The browser cannot save this preference. Playback controls still work.';
    }
}
function togglePause() {
    paused.value = !paused.value;
    savePause();
    announcement.value = paused.value ? 'Path replay paused. The recorded result remains visible.' : 'Path replay resumed.';
}
function finish(event: AnimationEvent) {
    if (event.target instanceof HTMLElement && event.target.dataset.finish === 'true') replaying.value = false;
}
function updateMotion() {
    reducedMotion.value = media?.matches ?? true;
    if (reducedMotion.value) replaying.value = false;
}
function updateVisibility() {
    pageVisible.value = document.visibilityState === 'visible';
}
onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)');
    updateMotion();
    updateVisibility();
    try {
        paused.value = localStorage.getItem(ASSEMBLY_PAUSE_KEY) === 'true';
    } catch {
        // A blocked storage API must not disable scenario selection.
    }
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    observer = new IntersectionObserver(([entry]) => {
        inView.value = entry.isIntersecting;
    });
    if (root.value) observer.observe(root.value);
    hydrated.value = true;
});
onBeforeUnmount(() => {
    observer?.disconnect();
    media?.removeEventListener('change', updateMotion);
    document.removeEventListener('visibilitychange', updateVisibility);
});
</script>

<template>
    <section ref="root" class="validation-showcase" aria-labelledby="validation-showcase-title" :data-scenario="selected" :data-playback="playback">
        <header class="validation-showcase-heading">
            <p class="validation-eyebrow">Proto-first validation</p>
            <h3 id="validation-showcase-title">One rule. Three different outcomes.</h3>
            <p>Change the request and see where it stops.</p>
        </header>
        <fieldset class="validation-scenarios">
            <legend>Choose a request</legend>
            <!-- biome-ignore lint/a11y/noLabelWithoutControl: Vue renders entry.label as text; the native label wraps and targets its radio. -->
            <label v-for="entry in data.scenarios" :key="entry.id" :for="`validation-request-${entry.id}`" :class="{ 'is-selected': selected === entry.id }">
                <input
                    :id="`validation-request-${entry.id}`"
                    type="radio"
                    name="validation-scenario"
                    :value="entry.id"
                    :checked="selected === entry.id"
                    :disabled="!hydrated"
                    @change="select(entry.id)"
                >
                <span>{{ entry.label }}</span>
            </label>
        </fieldset>
        <div class="validation-workspace">
            <div class="validation-source">
                <fieldset class="validation-source-picker" aria-label="Example source file">
                    <button type="button" :aria-pressed="source === 'proto'" :disabled="!hydrated" @click="source = 'proto'">inventory.proto</button>
                    <button type="button" :aria-pressed="source === 'handler'" :disabled="!hydrated" @click="source = 'handler'">handler.ts</button>
                </fieldset>
                <div v-show="source === 'proto'" class="validation-code validation-contract"><slot name="contract" /></div>
                <div v-show="source === 'handler'" class="validation-code validation-handler" v-html="data.handler" />
                <p class="validation-source-note">The proto checks the string. The handler checks whether the SKU exists.</p>
                <div class="validation-request-heading"><span>Request message</span><code>CheckStockRequest</code></div>
                <div class="validation-code validation-request" v-html="scenario.request" />
            </div>
            <div class="validation-result" :data-outcome="scenario.code">
                <div class="validation-result-heading">
                    <span>Recorded RPC result</span><strong>{{ scenario.code }}</strong>
                </div>
                <ol class="validation-trace" aria-label="Request execution path">
                    <li v-for="(step, index) in trace" :key="step.name" :data-reached="step.reached">
                        <span class="validation-step-number" aria-hidden="true">{{ index + 1 }}</span>
                        <div>
                            <strong>{{ step.name }}</strong><span>{{ step.detail }}</span>
                            <div v-if="index === 1" class="validation-rule-check" :data-rule-passed="scenario.validation.passed">
                                <dl>
                                    <div>
                                        <dt>Read <code>{{ scenario.validation.field }}</code></dt>
                                        <dd><code>{{ JSON.stringify(scenario.validation.value) }}</code></dd>
                                        <i v-if="replaying" :key="`value-${replayKey}`" class="validation-rule-cursor" style="--rule-step: 0" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <dt>Count characters</dt>
                                        <dd>{{ scenario.validation.characters }}</dd>
                                        <i v-if="replaying" :key="`count-${replayKey}`" class="validation-rule-cursor" style="--rule-step: 1" aria-hidden="true" />
                                    </div>
                                </dl>
                                <p class="validation-rule-comparison">
                                    <code>{{ scenario.validation.characters }} ≥ {{ scenario.validation.minimum }}</code>
                                    <strong>{{ scenario.validation.passed ? 'PASS' : 'FAIL' }}</strong>
                                    <i v-if="replaying" :key="`compare-${replayKey}`" class="validation-rule-cursor" style="--rule-step: 2" aria-hidden="true" />
                                </p>
                                <p class="validation-rule-decision">
                                    {{ scenario.validation.passed ? 'Constraint met. Continue to the handler.' : 'Too short. Reject before the handler.' }}
                                </p>
                            </div>
                        </div>
                        <em v-if="index !== 1">{{ step.state }}</em>
                        <i
                            v-if="replaying && step.reached"
                            :key="`${replayKey}-${index}`"
                            class="validation-path-arrival"
                            :style="{ '--arrival-step': index }"
                            :data-finish="index === (scenario.handlerCalls ? 2 : 1)"
                            aria-hidden="true"
                            @animationend="finish"
                        />
                    </li>
                </ol>
                <div class="validation-output-heading">
                    <span>{{ scenario.code === 'OK' ? 'Response message' : 'ConnectError' }}</span><span>Handler calls: <strong>{{ scenario.handlerCalls }}</strong></span>
                </div>
                <template v-if="scenario.message">
                    <p class="validation-error-message">{{ scenario.message }}</p>
                    <details class="validation-error-json">
                        <summary>Inspect error JSON</summary>
                        <div class="validation-code validation-output" v-html="scenario.result" />
                    </details>
                </template>
                <div v-else class="validation-code validation-output" v-html="scenario.result" />
            </div>
        </div>
        <p class="validation-explanation">{{ scenario.explanation }}</p>
        <div class="validation-playback">
            <p>{{ data.transport }} · Recorded from the example below. No RPC runs in this browser.</p>
            <div v-if="hydrated && !reducedMotion" class="validation-playback-buttons">
                <button type="button" @click="replay">Replay path</button>
                <button type="button" :disabled="!replaying" :aria-pressed="paused" @click="togglePause">{{ paused ? 'Resume' : 'Pause' }}</button>
            </div>
        </div>
        <p class="validation-status" role="status" aria-live="polite" aria-atomic="true">{{ announcement }}</p>
        <details class="validation-transcript">
            <summary>Compare all three requests without animation</summary>
            <div v-for="entry in data.scenarios" :key="entry.id" class="validation-transcript-entry">
                <h4>{{ entry.label }} · {{ entry.code }}</h4>
                <p>{{ entry.explanation }} Handler calls: {{ entry.handlerCalls }}.</p>
                <p class="validation-transcript-rule">
                    Field <code>{{ entry.validation.field }}</code> is <code>{{ JSON.stringify(entry.validation.value) }}</code>:
                    {{ entry.validation.characters }}
                    characters ≥ {{ entry.validation.minimum }} required.
                    <strong>{{ entry.validation.passed ? 'PASS' : 'FAIL' }}</strong>.
                </p>
                <div class="validation-code" v-html="entry.request" />
                <div class="validation-code" v-html="entry.result" />
            </div>
        </details>
        <details class="validation-example">
            <summary>Run the example and inspect the server setup</summary>
            <p>From a checkout of the documentation repository, run:</p>
            <div class="validation-code" v-html="data.commands" />
            <p>
                The test starts a real Connectum server and sends each request over HTTP. It reads the minimum length from the generated descriptor, records the field value and
                character count, and checks the rule explanation against actual handler invocations.
            </p>
            <p>Default interceptors install validation. The generated descriptors retain the constraint imported from <code>buf/validate/validate.proto</code>.</p>
            <div class="validation-code" v-html="data.server" />
            <p>Complete contract:</p>
            <div class="validation-code" v-html="data.proto" />
            <p>Example handler and inventory data:</p>
            <div class="validation-code" v-html="data.handler" />
        </details>
    </section>
</template>

<style src="../styles/validation-showcase.css"></style>
