<script setup lang="ts">
import { computed } from 'vue';
import { annotations, methods } from '../../openapi/settings.ts';
import { data } from '../../openapi/showcase.data.ts';
import { useOpenapiDemo } from '../../openapi/useOpenapiDemo.ts';

const { annotation, method, phase, result, output, fullOutput, error, enabled, reset, retry } = useOpenapiDemo(data.initial, data.initialOutput, data.initialFull);
const source = computed(() => data.examples.find((example) => example.settings.annotation === annotation.value && example.settings.method === method.value)?.source ?? '');
const denied = computed(() => result.value?.kind === 'patched' && result.value.auth.policy === 'deny');
</script>

<template>
    <section class="openapi-showcase" aria-labelledby="openapi-showcase-title" :data-phase="phase" :data-annotation="annotation" :data-method="method" :data-result="result?.kind">
        <header class="openapi-heading">
            <p class="openapi-eyebrow">Proto options → OpenAPI security</p>
            <h2 id="openapi-showcase-title">Change the annotation. Inspect the spec.</h2>
            <p>Keep the RPC unchanged. Switch its auth option and see what the overlay writes into the generated OpenAPI document.</p>
        </header>
        <div class="openapi-controls">
            <div>
                <label for="openapi-annotation">Method auth option</label>
                <select id="openapi-annotation" v-model="annotation" :disabled="!enabled">
                    <option v-for="entry in annotations" :key="entry.id" :value="entry.id">{{ entry.label }}</option>
                </select>
            </div>
            <div>
                <label for="openapi-method">RPC in the base spec</label>
                <select id="openapi-method" v-model="method" :disabled="!enabled">
                    <option v-for="entry in methods" :key="entry.id" :value="entry.id">{{ entry.label }}</option>
                </select>
            </div>
            <button type="button" :disabled="!enabled" @click="reset">Reset</button>
        </div>
        <div class="openapi-workspace">
            <div class="openapi-source">
                <p class="openapi-pane-heading">Selected proto method</p>
                <div class="openapi-code openapi-options-code" v-html="source" />
                <template v-if="result?.kind === 'patched'">
                    <p class="openapi-resolved-heading"><code>resolveMethodAuth(method)</code></p>
                    <dl class="openapi-resolved">
                        <div>
                            <dt>public</dt>
                            <dd><code>{{ result.auth.public }}</code></dd>
                        </div>
                        <div>
                            <dt>internal</dt>
                            <dd><code>{{ result.auth.internal }}</code></dd>
                        </div>
                        <div>
                            <dt>policy</dt>
                            <dd><code>{{ result.auth.policy ?? '(unset)' }}</code></dd>
                        </div>
                    </dl>
                </template>
                <p v-else-if="result?.kind === 'skipped'" class="openapi-reading-note">The overlay checks for a POST operation before reading this method’s auth options.</p>
            </div>
            <div class="openapi-result" :aria-busy="phase === 'loading' || phase === 'running'">
                <p class="openapi-pane-heading">OpenAPI security fragment</p>
                <div
                    class="openapi-outcome"
                    :class="{ 'openapi-outcome--warning': denied || result?.kind === 'skipped', 'openapi-outcome--error': result?.kind === 'rejected' || error }"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <template v-if="result?.kind === 'patched'">
                        <strong>{{ denied ? 'Deny is not encoded by security' : 'POST operation patched' }}</strong>
                        <p v-if="denied">
                            The reader resolves <code>policy: "deny"</code>, but this overlay still writes a Bearer requirement. Credentials in the spec do not mean the server will
                            authorize a call.
                        </p>
                        <p v-else-if="result.auth.public"><code>security: []</code> explicitly removes the operation’s credential requirement.</p>
                        <p v-else-if="result.auth.internal">This operation documents an <code>x-internal-token</code> header, not an end-user Bearer token.</p>
                        <p v-else-if="result.auth.requires">Roles and scopes are vendor extensions. An HTTP Bearer requirement still has an empty scope array.</p>
                        <p v-else>A Bearer scheme describes how to authenticate. Authorization still depends on the server’s policy.</p>
                    </template>
                    <template v-else-if="result?.kind === 'skipped'">
                        <strong>No POST to patch</strong>
                        <p>The base generator left this streaming path empty. The overlay skips it; changing an auth option does not create the missing operation.</p>
                    </template>
                    <template v-else-if="result?.kind === 'rejected'">
                        <strong>Public and internal conflict</strong>
                        <p>{{ result.message }}</p>
                    </template>
                    <template v-else-if="error"
                        ><strong>Overlay unavailable</strong>
                        <p>{{ error }}</p></template
                    >
                    <template v-else><strong>{{ phase === 'loading' ? 'Loading the local overlay…' : 'Applying the selected options…' }}</strong></template>
                </div>
                <div v-if="output" class="openapi-code openapi-output-code" v-html="output" />
                <button v-if="error" type="button" @click="retry">Retry local overlay</button>
            </div>
        </div>
        <p class="openapi-local-note">
            Live authz overlay using <code>resolveMethodAuth</code> from <code>@connectum/auth</code>. The base spec is pre-generated; buf/protoc and an RPC server do not run in
            this page. The controls edit compiled method options, not arbitrary proto text.
        </p>
        <p v-if="phase === 'static'" class="openapi-static-note">Successful build-time overlay. Editing requires JavaScript.</p>
        <details v-if="fullOutput" class="openapi-full-output">
            <summary>Inspect the complete document after this overlay</summary>
            <p>The fragment above shows only the fields written by the overlay. The full document retains the generated request, response and error schemas.</p>
            <div class="openapi-code" v-html="fullOutput" />
        </details>
        <details class="openapi-implementation">
            <summary>Read the overlay and generation input</summary>
            <p>
                The page calls this function on a fresh base document and an edited method descriptor. The public/internal conflict guard belongs to this example overlay; reading
                the options alone does not validate that combination.
            </p>
            <div class="openapi-code" v-html="data.overlaySource" />
            <p>
                The checked-in base was generated with <code>protoc-gen-connect-openapi</code>. A normalization step supplies the required <code>info.version</code>. Regenerating
                it needs network access; ordinary site builds use the committed artifact. Generator and input versions are recorded in the provenance files.
            </p>
            <div class="openapi-code" v-html="data.generation" />
            <div class="openapi-code" v-html="data.fullProto" />
            <p><a href="/en/guide/openapi-generation">Use the complete generation recipe →</a></p>
        </details>
        <details class="openapi-static-comparisons">
            <summary>Compare all annotations without JavaScript</summary>
            <div v-for="example in data.examples" :key="`${example.settings.method}-${example.settings.annotation}`">
                <h3>{{ example.settings.method }} · {{ annotations.find(entry => entry.id === example.settings.annotation)?.label }}</h3>
                <p v-if="example.message">{{ example.message }}</p>
                <div v-else class="openapi-code" v-html="example.output" />
            </div>
        </details>
    </section>
</template>

<style src="../styles/openapi-showcase.css" />
