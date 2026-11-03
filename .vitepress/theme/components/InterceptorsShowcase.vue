<script setup lang="ts">
import { ref } from 'vue';
import { chains, handlerOutcomes } from '../../interceptors/settings.ts';
import { data } from '../../interceptors/showcase.data.ts';
import { useInterceptorsDemo } from '../../interceptors/useInterceptorsDemo.ts';

const source = ref<keyof typeof data.sources>('audit');
const { chain, outcome, result, phase, error, enabled, reset, retry } = useInterceptorsDemo(data.initial);
</script>

<template>
    <section class="interceptors-showcase" aria-labelledby="interceptors-showcase-title" :data-phase="phase" :data-chain="chain" :data-outcome="outcome">
        <header class="interceptors-heading">
            <p class="interceptors-eyebrow">Wrap next, then observe the return</p>
            <h2 id="interceptors-showcase-title">Change the order. Check the header.</h2>
            <p><code>stockTag</code> adds a response header. Move <code>audit</code> inside it: does its after-step see the header yet?</p>
        </header>
        <div class="interceptors-controls">
            <div>
                <label for="interceptors-chain">Interceptor chain</label>
                <select id="interceptors-chain" v-model="chain" :disabled="!enabled">
                    <option v-for="entry in chains" :key="entry.id" :value="entry.id">{{ entry.label }}</option>
                </select>
            </div>
            <div>
                <label for="interceptors-outcome">Handler outcome</label>
                <select id="interceptors-outcome" v-model="outcome" :disabled="!enabled">
                    <option v-for="entry in handlerOutcomes" :key="entry.id" :value="entry.id">{{ entry.label }}</option>
                </select>
            </div>
            <button type="button" :disabled="!enabled" @click="reset">Reset</button>
        </div>
        <div class="interceptors-workspace">
            <div class="interceptors-source">
                <p class="interceptors-pane-heading">Selected composition</p>
                <div class="interceptors-code interceptors-composition" v-html="data.compositions[chain]" />
                <p class="interceptors-reading-note">
                    <code>audit</code>
                    and <code>stockTag</code> are created by the factories below. Their <code>write</code> callback appends to this log.
                </p>
                <fieldset class="interceptors-source-picker" aria-label="Example source file">
                    <button v-for="(entry, key) in data.sources" :key="key" type="button" :aria-pressed="source === key" :disabled="!enabled" @click="source = key">
                        {{ entry.label }}
                    </button>
                </fieldset>
                <div
                    v-for="(entry, key) in data.sources"
                    v-show="source === key"
                    :key="key"
                    class="interceptors-code interceptors-implementation"
                    :data-source="key"
                    v-html="entry.html"
                />
            </div>
            <div class="interceptors-result" :aria-busy="phase === 'running'">
                <p class="interceptors-pane-heading">Observed execution log</p>
                <template v-if="result">
                    <ol class="interceptors-log" aria-label="Interceptor execution log">
                        <li v-for="(entry, index) in result.events" :key="index"><code>{{ entry }}</code></li>
                    </ol>
                    <div class="interceptors-caller" role="status" aria-live="polite" aria-atomic="true">
                        <strong>{{ result.code === 'OK' ? 'Successful call' : result.code }}</strong>
                        <dl>
                            <div>
                                <dt>Caller’s x-stock-source</dt>
                                <dd><code>{{ result.sourceHeader ?? '(not set)' }}</code></dd>
                            </div>
                            <div>
                                <dt>Handler calls</dt>
                                <dd>{{ result.handlerCalls }}</dd>
                            </div>
                        </dl>
                        <p v-if="result.response"><code>{{ JSON.stringify(result.response) }}</code></p>
                        <p v-else>{{ result.error }}</p>
                    </div>
                    <p class="interceptors-reading-note">
                        {{ result.code === 'OK' ? 'Read the after-steps from the inside out. Compare what audit saw with the header the caller received.' : 'next(req) rejected, so no after-step ran. The error reached the caller.' }}
                    </p>
                </template>
                <p v-else-if="error" role="status" class="interceptors-error">{{ error }}</p>
                <p v-else role="status">Running this composition…</p>
                <button v-if="error" type="button" @click="retry">Retry local call</button>
            </div>
        </div>
        <p class="interceptors-local-note">
            Runs real custom interceptors through Connect-ES’s in-memory router transport. No network request is sent. The inventory is fixture data; this page does not start a
            Connectum server.
        </p>
        <p v-if="!enabled && !error && result" class="interceptors-static-note">
            Static successful run. Editing requires JavaScript<span v-if="phase === 'loading'">; loading the runtime…</span>.
        </p>
        <details class="interceptors-comparisons">
            <summary>Compare the compositions without JavaScript</summary>
            <div v-for="entry in data.comparisons" :key="`${entry.settings.chain}-${entry.settings.outcome}`">
                <h3>{{ entry.label }} · {{ entry.result.code }}</h3>
                <ol class="interceptors-log">
                    <li v-for="(event, index) in entry.result.events" :key="index"><code>{{ event }}</code></li>
                </ol>
                <p>Caller’s <code>x-stock-source</code>: <code>{{ entry.result.sourceHeader ?? '(not set)' }}</code>.</p>
            </div>
        </details>
        <details class="interceptors-example">
            <summary>Run the same interceptors on a real Connectum server</summary>
            <p>The standalone test sends all six composition/outcome combinations over HTTP and checks their logs, responses and headers.</p>
            <div class="interceptors-code" v-html="data.commands" />
            <p>The custom interceptors are appended after the default error handling and validation:</p>
            <div class="interceptors-code" v-html="data.setup" />
            <div v-for="entry in data.sources" :key="entry.label">
                <h3>{{ entry.label }}</h3>
                <div class="interceptors-code" v-html="entry.html" />
            </div>
        </details>
    </section>
</template>

<style src="../styles/interceptors-showcase.css"></style>
