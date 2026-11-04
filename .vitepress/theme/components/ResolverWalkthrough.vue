<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { type CatalogScene, catalogCall, explainRoute, scenes } from '../../catalog/model.ts';

const selected = ref<CatalogScene>('local');
const scene = computed(() => explainRoute(selected.value));
const paused = ref(false);
const hydrated = ref(false);
onMounted(() => {
    hydrated.value = true;
});
function select(id: CatalogScene) {
    selected.value = id;
}
</script>

<template>
    <section class="catalog-walkthrough" aria-label="Follow a catalog call">
        <fieldset class="catalog-scene-picker">
            <legend>Where does Inventory live?</legend>
            <label v-for="(item, index) in scenes" :key="item.id" :class="{ 'is-selected': selected === item.id }">
                <input type="radio" name="catalog-scene" :value="item.id" :checked="selected === item.id" :disabled="!hydrated" @change="select(item.id)">
                <span class="catalog-step-number" aria-hidden="true">0{{ index + 1 }}</span>
                <span>{{ item.label }}</span>
            </label>
        </fieldset>

        <div class="catalog-call-block">
            <div class="catalog-code-heading"><strong>Orders calls Inventory</strong><span>Same call in every scene</span></div>
            <div class="catalog-call-code" role="region" aria-label="Unchanged catalog call">
                <slot name="call"><pre><code>{{ catalogCall }}</code></pre></slot>
            </div>
        </div>

        <figure
            :key="scene.id"
            class="catalog-route-figure"
            :class="{ 'catalog-route-figure--animated': hydrated, 'catalog-route-figure--paused': paused, 'catalog-route-figure--blocked': scene.kind === 'unavailable' }"
        >
            <div class="catalog-process-layout" :class="{ 'catalog-process-layout--local': scene.local }" aria-hidden="true">
                <div class="catalog-shared-boundary"><span>One process</span></div>
                <div class="catalog-process catalog-process--caller">
                    <span class="catalog-process-label">{{ scene.local ? 'Caller' : 'Orders process' }}</span>
                    <div class="catalog-service-card"><span class="catalog-service-initial">O</span><strong>Orders</strong><small>CheckAvailability</small></div>
                </div>
                <div class="catalog-route-bridge">
                    <span class="catalog-route-label">{{ scene.routeLabel }}</span>
                    <span class="catalog-route-track">
                        <svg class="catalog-route-arrow" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
                            <template v-if="scene.kind === 'unavailable'">
                                <path d="M3 10H45" stroke-dasharray="5 4" />
                                <path d="M48 5L58 15M58 5L48 15" />
                            </template>
                            <path v-else d="M9 4L3 10L9 16M3 10H97M91 4L97 10L91 16" />
                        </svg>
                        <span class="catalog-route-packet"></span>
                    </span>
                </div>
                <div class="catalog-process catalog-process--target">
                    <span class="catalog-process-label">{{ scene.local ? 'Target' : 'Inventory process' }}</span>
                    <div class="catalog-service-card"><span class="catalog-service-initial">I</span><strong>Inventory</strong><small>CheckStock</small></div>
                </div>
            </div>
            <figcaption>
                {{ scene.local ? 'Inventory runs here: no network call.' : scene.hasRoute ? 'Inventory runs elsewhere: use the configured gRPC route.' : 'No route to Inventory: fail before calling its handler.' }}
            </figcaption>
        </figure>

        <div class="catalog-result" role="status" aria-live="polite" aria-atomic="true" :class="{ 'catalog-result--error': scene.kind === 'unavailable' }">
            <div class="catalog-result-heading">
                <strong>{{ scene.kind === 'unavailable' ? 'Call failed' : 'Response' }}</strong>
                <span>{{ scene.kind === 'unavailable' ? 'Inventory was not called' : 'Inventory → Orders' }}</span>
            </div>
            <code>{{ scene.result }}</code>
            <p>{{ scene.kind === 'unavailable' ? 'There is no route to Inventory, so Orders receives an error instead of stock data.' : '7 units of A-1 are in stock.' }}</p>
        </div>
        <p class="catalog-model-note">Illustration, not a live RPC. Run the complete example linked below to make the real call.</p>

        <details class="catalog-config">
            <summary>How is this call routed?</summary>
            <p><strong>{{ scene.title }}</strong> {{ scene.description }}</p>
            <ol class="catalog-trace" aria-label="Call path">
                <li v-for="step in scene.steps" :key="step">{{ step }}</li>
            </ol>
            <pre tabindex="0" role="region" aria-label="Configuration for the selected scene"><code>{{ scene.configuration }}</code></pre>
            <p><code>inventoryTransport</code> is a configured gRPC transport to the other process. A local target takes priority even when a remote route exists.</p>
            <label class="catalog-motion-setting"><input v-model="paused" type="checkbox" :disabled="!hydrated"> Pause animation</label>
        </details>
    </section>
</template>

<style src="../styles/catalog-lesson.css"></style>
