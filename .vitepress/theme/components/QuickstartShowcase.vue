<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue';
import type { RequestClient, RequestCredential } from '../../quickstart/additions/requests/variants.ts';
import { data } from '../../quickstart/showcase.data.ts';
import { useCodeAnimation } from '../../quickstart/useCodeAnimation.ts';

const root = ref<HTMLElement>();
const animation = useCodeAnimation(root);
const enabled = ref(false);
const active = ref('init');
const client = ref<RequestClient>('curl');
const credential = ref<RequestCredential>('successful');
const response = shallowRef<(typeof data.requests)[number] | null>(null);
const sends = ref(0);
const selectedRequest = computed(() => {
    const request = data.requests.find((request) => request.client === client.value && request.credential === credential.value);
    if (!request) throw new Error('The selected request has no captured response.');
    return request;
});

watch(animation.run, () => {
    if (active.value === 'inspect') response.value = null;
});
watch(animation.part, (part) => {
    if (part === 1 && active.value === 'inspect' && animation.playing.value) receive();
});

function receive() {
    response.value = selectedRequest.value;
    sends.value += 1;
}

// biome-ignore lint/correctness/noUnusedVariables: Vue binds this handler in the step buttons.
async function select(id: string) {
    animation.finish();
    active.value = id;
    response.value = null;
    await nextTick();
    animation.replay();
}

// biome-ignore lint/correctness/noUnusedVariables: Vue binds the client buttons to this handler.
async function chooseClient(value: RequestClient) {
    animation.finish();
    client.value = value;
    response.value = null;
    await nextTick();
    animation.replay();
}

// biome-ignore lint/correctness/noUnusedVariables: Vue binds the credential buttons to this handler.
async function chooseCredential(value: RequestCredential) {
    animation.finish();
    credential.value = value;
    response.value = null;
    await nextTick();
    animation.replay();
}

// biome-ignore lint/correctness/noUnusedVariables: Vue binds the send button to this handler.
function send() {
    animation.finish();
    receive();
}

onMounted(() => {
    enabled.value = true;
});
</script>

<template>
    <section ref="root" class="quickstart-showcase" aria-labelledby="quickstart-title" :data-step="active" :data-client="client" :data-credential="credential" :data-sends="sends" :data-animation="animation.phase.value" :data-frame="animation.frame.value" :data-animation-part="animation.part.value">
        <header class="quickstart-heading">
            <p class="quickstart-eyebrow">From init to a protected page</p>
            <h2 id="quickstart-title">Build a protected Page service</h2>
            <p>Describe the operation, generate its types and add the handler. The server foundation comes from the CLI.</p>
        </header>
        <div class="quickstart-navigation">
        <div class="quickstart-steps" role="group" aria-label="Quickstart steps">
            <button v-for="(step, index) in data.steps" :key="step.id" type="button" :disabled="!enabled" :aria-pressed="active === step.id" @click="select(step.id)">
                <span aria-hidden="true">{{ index + 1 }}</span> {{ step.label }}
            </button>
        </div>
        <div class="quickstart-playback" role="group" aria-label="Code animation controls">
            <button type="button" :disabled="!enabled || animation.reduced.value" :aria-label="animation.playing.value ? 'Pause animation' : 'Play animation'" :title="animation.playing.value ? 'Pause animation' : 'Play animation'" @click="animation.toggle">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="animation.playing.value ? 'M6 5h4v14H6zm8 0h4v14h-4z' : 'M8 5v14l11-7z'" /></svg>
            </button>
            <button type="button" :disabled="!enabled || animation.reduced.value" aria-label="Replay animation" title="Replay animation" @click="animation.replay">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11a9 9 0 1 0 3-6.7M3 3v6h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
        </div>
        </div>
        <progress class="quickstart-progress" :value="animation.frame.value" max="1" aria-label="Current step animation progress" />
        <p v-if="enabled && animation.reduced.value" class="quickstart-motion-note">Reduced motion: complete code is shown without animation.</p>
        <div class="quickstart-workspace">
            <div class="quickstart-source">
                <template v-for="step in data.steps" :key="step.id">
                    <div v-show="active === step.id" class="quickstart-stage" :data-source="step.id">
                        <h3>{{ step.title }}</h3>
                        <p>{{ step.text }}</p>
                        <template v-if="step.id !== 'inspect'">
                            <p class="quickstart-file"><code>{{ step.file }}</code></p>
                            <div class="quickstart-code" data-animation-part="0" v-html="step.html" />
                        </template>
                        <div v-if="step.id === 'init'" class="quickstart-created-files" data-animation-part="1">
                            <p class="quickstart-file"><code>private-page/</code> · scaffolded source files</p>
                            <p>Files created by init. Installed dependencies are omitted.</p>
                            <div class="quickstart-code" v-html="step.tree" />
                        </div>
                        <template v-if="step.id === 'handler'">
                            <p>Add <code>pageService</code> to the server’s services. This is the complete <code>src/server.ts</code>:</p>
                            <div class="quickstart-code quickstart-registration" data-animation-part="1" v-html="data.server" />
                            <details class="quickstart-startup" data-animation-part="2">
                                <summary>Configure the issuer and start the service</summary>
                                <p>Replace the example issuer URL with yours. Use a JWT issued for the configured audience in the next step. The console exporter keeps this check independent of a telemetry backend.</p>
                                <div class="quickstart-code" v-html="data.start" />
                            </details>
                        </template>
                        <details v-if="step.id === 'types'" class="quickstart-generated" data-animation-part="1">
                            <summary>Read the generated descriptor and message types</summary>
                            <p class="quickstart-file"><code>gen/page/v1/page_pb.ts</code></p>
                            <div class="quickstart-code" v-html="step.generated" />
                        </details>
                        <div v-if="step.id === 'inspect' && active === 'inspect'" class="quickstart-terminal" aria-label="Request emulator">
                            <div class="quickstart-request-controls">
                                <div class="quickstart-client" role="group" aria-label="Request client">
                                    <button v-for="entry in data.clients" :key="entry.id" type="button" :disabled="!enabled" :aria-pressed="client === entry.id" @click="chooseClient(entry.id)">{{ entry.label }}</button>
                                </div>
                                <div class="quickstart-cases" role="group" aria-label="Request credentials">
                                    <button v-for="entry in data.credentials" :key="entry.id" type="button" :disabled="!enabled" :aria-pressed="credential === entry.id" @click="chooseCredential(entry.id)">{{ entry.label }}</button>
                                </div>
                            </div>
                            <p class="quickstart-file"><code>{{ client === 'curl' ? 'Connect HTTP/2' : 'Native gRPC' }} · page.v1.PageService/GetPage</code></p>
                            <div class="quickstart-code quickstart-request-command" data-animation-part="0" v-html="selectedRequest.command" />
                            <button class="quickstart-send" type="button" :disabled="!enabled" @click="send">Send request</button>
                            <div class="quickstart-response" data-animation-part="1" :data-state="response ? 'received' : 'idle'">
                                <div role="status" aria-live="polite" aria-atomic="true">
                                    <p v-if="response" class="quickstart-status" :class="{ 'quickstart-status--denied': !response.successful }">Response {{ sends }} · {{ response.status }}</p>
                                    <p v-else class="quickstart-idle">No response yet. Send the request to see its result.</p>
                                </div>
                                <div v-show="response" class="quickstart-code quickstart-response-body" v-html="selectedRequest.response" />
                            </div>
                            <p class="quickstart-result-note">Playback types and sends the request, then reveals its captured response. Send request also runs it immediately. This is local emulation; no shell or network RPC runs in this page.</p>
                        </div>
                        <div v-if="step.id === 'inspect'" class="quickstart-capabilities">
                            <div><strong>Health</strong><code>{{ data.recording.health.status }}</code></div>
                            <div><strong>Reflection</strong><code>page.v1.PageService</code></div>
                            <div><strong>OTel span</strong><code>{{ data.recording.otel.spans[0] }}</code></div>
                        </div>
                        <details v-if="step.id === 'inspect'">
                            <summary>Inspect the generated OpenAPI document</summary>
                            <p>The pinned Buf plugin generates the schema. A separate overlay reads the method’s auth options and adds Bearer security. Follow the <a href="/en/guide/openapi">OpenAPI workflow</a> to set this up in your service.</p>
                            <div class="quickstart-code" v-html="data.openapi" />
                        </details>
                    </div>
                </template>
            </div>
        </div>
        <p class="quickstart-boundary">These are code and recorded results from the included runnable example. Selecting a step does not run a shell, compiler or server in this page.</p>
        <details class="quickstart-setup">
            <summary>Read the complete server and authentication setup</summary>
            <p>Configure <code>JWKS_URI</code>, <code>JWT_ISSUER</code> and <code>JWT_AUDIENCE</code> for your issuer. The verification helper uses temporary test-only keys and a loopback JWKS endpoint; init does not create a login service.</p>
            <p>The CLI adds a narrow allow rule for health and reflection probes. This example preserves it unchanged. <code>GetPage</code> still requires a verified JWT. Protocol registration alone does not grant authorization.</p>
            <h3>src/server.ts</h3><div class="quickstart-code" v-html="data.server" />
            <h3>src/auth.ts</h3><div class="quickstart-code" v-html="data.auth" />
        </details>
        <details class="quickstart-static-steps">
            <summary>Read every step without JavaScript</summary>
            <div v-for="step in data.steps" :key="step.id">
                <h3>{{ step.title }}</h3><p>{{ step.text }}</p>
                <div class="quickstart-code" v-html="step.html" />
                <div v-if="step.id === 'init'" class="quickstart-code" v-html="step.tree" />
                <div v-if="step.id === 'types'" class="quickstart-code" v-html="step.generated" />
                <template v-if="step.id === 'inspect'">
                    <div class="quickstart-code" v-html="data.requests[0].command" />
                    <p>Recorded successful curl response:</p>
                    <div class="quickstart-code" v-html="data.requests[0].response" />
                </template>
                <template v-if="step.id === 'handler'">
                    <p>Register the service and configure your issuer before starting:</p>
                    <div class="quickstart-code quickstart-registration" v-html="data.server" />
                    <div class="quickstart-code" v-html="data.start" />
                </template>
            </div>
        </details>
        <details>
            <summary>Reproduce the captured checks from the documentation source</summary>
            <p>The target framework checkout must be built and match the recorded source revision. Generate the project first; the verifier then runs its real process entry, including OTel initialization and shutdown.</p>
            <div class="quickstart-code" v-html="data.verify" />
        </details>
    </section>
</template>

<style src="../styles/quickstart-showcase.css" />
