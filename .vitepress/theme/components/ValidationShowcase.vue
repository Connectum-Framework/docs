<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import type { Evaluation } from '../../validation/model.ts';
import { data } from '../../validation/showcase.data.ts';

const sku = ref<string>(data.initialInput.sku);
const quantity = ref(data.initialInput.quantity);
const evaluator = shallowRef<typeof import('../../validation/runtime.ts').evaluateInput>();
const loadError = ref(false);
const loading = ref(false);
let active = true;

const result = computed<Evaluation>(() => {
    if (loadError.value) {
        return { kind: 'runtime-error', validation: 'error', handlerCalls: 0, code: 'Unavailable', issues: [], message: 'Could not load the validator. Retry to enable the form.' };
    }
    if (!evaluator.value) return data.initial;
    try {
        return evaluator.value({ sku: sku.value, quantity: quantity.value });
    } catch {
        return {
            kind: 'runtime-error',
            validation: 'error',
            handlerCalls: 0,
            code: 'Validator error',
            issues: [],
            message: 'The example could not run. No validation result is available.',
        };
    }
});
const skuIssues = computed(() => result.value.issues.filter((issue) => issue.field === 'sku'));
const quantityIssues = computed(() => result.value.issues.filter((issue) => issue.field === 'quantity'));
const ready = computed(() => Boolean(evaluator.value) && !loadError.value);

async function load() {
    loading.value = true;
    loadError.value = false;
    try {
        const module = await import('../../validation/runtime.ts');
        if (active) evaluator.value = module.evaluateInput;
    } catch {
        if (active) loadError.value = true;
    } finally {
        if (active) loading.value = false;
    }
}
function reset() {
    sku.value = data.initialInput.sku;
    quantity.value = data.initialInput.quantity;
}
onMounted(load);
onBeforeUnmount(() => {
    active = false;
});
</script>

<template>
    <section class="validation-showcase" aria-labelledby="validation-showcase-title" :data-ready="ready" :data-state="result.kind">
        <header class="validation-showcase-heading">
            <p class="validation-eyebrow">Proto-first validation</p>
            <h3 id="validation-showcase-title">Try the rules</h3>
            <p>Set quantity to <code>0</code>, then fix it. The error comes from the rule beside the field.</p>
        </header>
        <div class="validation-workspace">
            <div class="validation-source">
                <p class="validation-pane-heading">inventory.proto</p>
                <div
                    class="validation-code validation-contract"
                    :data-invalid-sku="skuIssues.some(issue => issue.rule)"
                    :data-invalid-quantity="quantityIssues.some(issue => issue.rule)"
                >
                    <slot name="contract" />
                </div>
                <p class="validation-source-note">The generated descriptor carries both rules. Protovalidate reads them on every edit.</p>
            </div>
            <form class="validation-form" aria-label="Try proto validation" novalidate @submit.prevent>
                <div class="validation-form-heading">
                    <p class="validation-pane-heading">CheckStockRequest</p>
                    <button type="button" :disabled="!ready" @click="reset">Reset</button>
                </div>
                <div class="validation-field">
                    <label for="validation-sku">SKU</label>
                    <input
                        id="validation-sku"
                        v-model="sku"
                        type="text"
                        autocomplete="off"
                        spellcheck="false"
                        :disabled="!ready"
                        :aria-invalid="skuIssues.length > 0"
                        aria-describedby="validation-sku-hint validation-sku-error"
                    >
                    <p id="validation-sku-hint" class="validation-hint">Try <code>A-1</code>, an empty value or <code>UNKNOWN</code>.</p>
                    <p id="validation-sku-error" class="validation-field-error">
                        <span v-for="issue in skuIssues" :key="issue.rule">{{ issue.message }} <code v-if="issue.rule">{{ issue.rule }}</code></span>
                    </p>
                </div>
                <div class="validation-field">
                    <label for="validation-quantity">Quantity</label>
                    <input
                        id="validation-quantity"
                        v-model="quantity"
                        type="text"
                        inputmode="numeric"
                        autocomplete="off"
                        spellcheck="false"
                        :disabled="!ready"
                        :aria-invalid="quantityIssues.length > 0"
                        aria-describedby="validation-quantity-hint validation-quantity-error"
                    >
                    <p id="validation-quantity-hint" class="validation-hint">A whole number. Try <code>2 → 0 → 2</code>.</p>
                    <p id="validation-quantity-error" class="validation-field-error">
                        <span v-for="issue in quantityIssues" :key="issue.rule ?? issue.message">{{ issue.message }} <code v-if="issue.rule">{{ issue.rule }}</code></span>
                    </p>
                </div>
                <div class="validation-live-result" role="status" aria-live="polite" aria-atomic="true" :data-outcome="result.code">
                    <div class="validation-result-heading">
                        <strong>{{ result.kind === 'valid' ? 'Valid request' : result.code }}</strong>
                    </div>
                    <p>{{ result.message }}</p>
                    <dl class="validation-boundaries">
                        <div>
                            <dt>Proto validation</dt>
                            <dd>
                                {{ result.validation === 'passed' ? 'Passed' : result.validation === 'failed' ? 'Rejected' : result.validation === 'error' ? 'Unavailable' : 'Not run' }}
                            </dd>
                        </div>
                        <div>
                            <dt>Example handler</dt>
                            <dd>{{ result.handlerCalls ? 'Called locally' : 'Not called' }}</dd>
                        </div>
                    </dl>
                    <p v-if="result.response" class="validation-response"><code>{{ JSON.stringify(result.response) }}</code></p>
                </div>
                <p v-if="!ready && !loadError" class="validation-hint">Static successful example. Editing requires JavaScript<span v-if="loading">; loading validator…</span>.</p>
                <button v-if="loadError" type="button" @click="load">Retry loading validator</button>
            </form>
        </div>
        <p class="validation-local-note">
            Runs in your browser with <code>@bufbuild/protovalidate</code> and the example handler. No RPC is sent. The handler looks up the SKU in a small inventory fixture.
        </p>
        <details class="validation-transcript">
            <summary>Compare example inputs</summary>
            <div v-for="entry in data.scenarios" :key="entry.id" class="validation-transcript-entry">
                <h4>{{ entry.label }} · {{ entry.code }}</h4>
                <p>{{ entry.explanation }}</p>
                <div class="validation-code" v-html="entry.request" />
                <div class="validation-code" v-html="entry.result" />
            </div>
        </details>
        <details class="validation-example">
            <summary>Run the RPC example and inspect the handler</summary>
            <p>From a checkout of the documentation repository, run:</p>
            <div class="validation-code" v-html="data.commands" />
            <p>The test starts a real Connectum server and sends requests over HTTP. It checks that invalid SKU and quantity values never reach the handler.</p>
            <p>Default interceptors install validation. The browser uses the same contract and handler; this setup runs them behind an RPC endpoint.</p>
            <div class="validation-code" v-html="data.server" />
            <p>Complete contract:</p>
            <div class="validation-code" v-html="data.proto" />
            <p>Example handler and inventory data:</p>
            <div class="validation-code" v-html="data.handler" />
        </details>
    </section>
</template>

<style src="../styles/validation-showcase.css"></style>
