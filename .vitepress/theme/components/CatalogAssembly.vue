<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ASSEMBLY_PAUSE_KEY, type AssemblyLayoutId, assemblyContracts, assemblyLayouts } from '../../catalog/assembly.ts';
import { data as assemblyCode } from '../../catalog/assembly-code.data.ts';

const highlightedLayouts = assemblyLayouts.map((item) => ({ ...item, codeBlock: assemblyCode[item.id] }));
const selected = ref<AssemblyLayoutId>('folder');
const layout = computed(() => highlightedLayouts.find((item) => item.id === selected.value) ?? highlightedLayouts[0]);
const root = ref<HTMLElement>();
const hydrated = ref(false);
const paused = ref(false);
const reducedMotion = ref(true);
const inView = ref(false);
const pageVisible = ref(true);
const playback = computed(() => (!hydrated.value || reducedMotion.value ? 'static' : paused.value ? 'paused' : inView.value && pageVisible.value ? 'running' : 'waiting'));
let media: MediaQueryList | undefined;
let observer: IntersectionObserver | undefined;

function updateMotion() {
    reducedMotion.value = media?.matches ?? true;
}
function updateVisibility() {
    pageVisible.value = document.visibilityState === 'visible';
}
function togglePause() {
    paused.value = !paused.value;
    try {
        localStorage.setItem(ASSEMBLY_PAUSE_KEY, String(paused.value));
    } catch {
        // pausing still works when the browser does not permit persistent preferences.
    }
}
onMounted(() => {
    try {
        paused.value = localStorage.getItem(ASSEMBLY_PAUSE_KEY) === 'true';
    } catch {
        // persistence is optional; motion controls are not.
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
    observer?.disconnect();
    media?.removeEventListener('change', updateMotion);
    document.removeEventListener('visibilitychange', updateVisibility);
});
</script>

<template>
    <section ref="root" class="catalog-assembly" aria-label="How a service catalog is assembled" :data-layout="selected" :data-playback="playback">
        <fieldset class="assembly-picker">
            <legend>Where are the contracts built?</legend>
            <label :class="{ 'is-selected': selected === 'folder' }"
                ><input v-model="selected" type="radio" name="catalog-build-layout" value="folder" :disabled="!hydrated">
                One folder</label
            >
            <label :class="{ 'is-selected': selected === 'packages' }"
                ><input v-model="selected" type="radio" name="catalog-build-layout" value="packages" :disabled="!hydrated">
                Separate packages</label
            >
            <label :class="{ 'is-selected': selected === 'repositories' }"
                ><input v-model="selected" type="radio" name="catalog-build-layout" value="repositories" :disabled="!hydrated">
                Separate repositories</label
            >
        </fieldset>
        <p class="assembly-explanation">{{ layout.explanation }}</p>

        <figure :key="selected" class="assembly-diagram">
            <div class="assembly-boundary">{{ layout.boundary }}</div>
            <div class="assembly-builds" :class="{ 'assembly-builds--split': layout.groups.length > 1 }">
                <div v-for="group in layout.groups" :key="group.root" class="assembly-build">
                    <code class="assembly-root">{{ group.root }}</code>
                    <div class="assembly-files">
                        <div v-for="id in group.contracts" :key="id" class="assembly-file" :data-contract="id">
                            <span class="assembly-file-icon" aria-hidden="true">{ }</span>
                            <div>
                                <code><span class="assembly-file-prefix">proto/shop/v1/</span>{{ assemblyContracts[id].file }}</code
                                ><small>{{ assemblyContracts[id].descriptor }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="assembly-generator">
                        <span class="assembly-fall" aria-hidden="true"
                            ><i v-for="id in group.contracts" :key="id" :data-contract="id">{{ assemblyContracts[id].name.slice(0, 1) }}</i></span
                        >
                        <code>buf generate</code>
                        <small>protobuf-es + catalog plugin</small>
                    </div>
                    <div class="assembly-generated">
                        <strong>gen/catalog.gen.ts</strong>
                        <div class="assembly-part-entries"><span v-for="id in group.contracts" :key="id" :data-contract="id">{{ assemblyContracts[id].descriptor }}</span></div>
                        <small>Map + type augmentations<br>Descriptors from <code>*_pb.ts</code></small>
                    </div>
                    <div v-if="group.dependency" class="assembly-delivery">
                        <span class="assembly-parcel" :data-contract="group.contracts[0]" aria-hidden="true">pkg</span>
                        <small>Build &amp; version a contract package</small>
                        <code>{{ group.dependency }}</code>
                        <small>Consumer installs .js + .d.ts</small>
                    </div>
                </div>
            </div>

            <small v-if="layout.groups.length > 1" class="assembly-mobile-origin">Two independently generated maps · both imported below</small>
            <div class="assembly-join" :class="{ 'assembly-join--merge': layout.groups.length > 1 }">
                <svg v-if="layout.groups.length > 1" class="assembly-join-lines" viewBox="0 0 600 68" preserveAspectRatio="none" aria-hidden="true">
                    <path class="assembly-orders-path" d="M150 0V16Q150 28 174 28H276Q300 28 300 48V68" />
                    <path class="assembly-inventory-path" d="M450 0V16Q450 28 426 28H324Q300 28 300 48V68" />
                </svg>
                <span v-for="id in ['orders', 'inventory']" :key="id" class="assembly-merge-sheet" :data-contract="id" aria-hidden="true">{{ id === 'orders' ? 'O' : 'I' }}</span>
                <div class="assembly-join-operation">
                    <small>Runtime map{{ layout.groups.length > 1 ? ' composition' : ' import' }}</small
                    ><code>{{ layout.groups.length === 1 ? 'import { serviceCatalog }' : 'mergeCatalogs(ordersCatalog, inventoryCatalog)' }}</code>
                </div>
            </div>

            <div class="assembly-result">
                <div class="assembly-result-title"><strong>Same two contracts in the application</strong><span>No hosts. No ports. No network scan.</span></div>
                <div class="assembly-outputs">
                    <div class="assembly-output">
                        <span class="assembly-output-label">Runtime value</span>
                        <code>catalog: ServiceCatalog</code>
                        <div v-for="(contract, id) in assemblyContracts" :key="id" class="assembly-result-entry" :data-contract="id">
                            <span class="assembly-entry-mark" aria-hidden="true">{{ contract.name.slice(0, 1) }}</span>
                            <code>{{ contract.typeName }}<br><span>→ {{ contract.descriptor }}</span></code>
                        </div>
                        <small>Pass the map to <code>createServer( { catalog, ... })</code>.</small>
                    </div>
                    <div class="assembly-output assembly-output--types">
                        <span class="assembly-output-label">TypeScript only</span>
                        <code>ConnectumCallMap</code>
                        <small>Loaded by the generated imports</small>
                        <div v-for="(contract, id) in assemblyContracts" :key="id" class="assembly-type-entry" :data-contract="id">
                            <strong>{{ contract.typeName }}/{{ contract.method }}</strong>
                        </div>
                        <small>Request/response types for each method. Import the declarations; <code>mergeCatalogs</code> merges values, not types.</small>
                    </div>
                </div>
            </div>
            <figcaption>{{ layout.caveat }}</figcaption>
        </figure>

        <div class="assembly-controls">
            <span
                >{{ playback === 'static' ? 'Static illustration' : playback === 'paused' ? 'Paused · completed artifacts shown' : 'Automatic build illustration' }}
                · No generator runs in this browser.</span
            >
            <button v-if="hydrated && !reducedMotion" type="button" @click="togglePause">{{ paused ? 'Resume animation' : 'Pause animation' }}</button>
        </div>

        <details class="assembly-code">
            <summary>Application imports for this layout</summary>
            <div class="assembly-snippet" v-html="layout.codeBlock" />
            <p v-if="layout.groups.length > 1">
                For packages, re-export <code>serviceCatalog</code> from the generated module. Its declarations must retain the augmentation of <code>@connectum/core</code>.
            </p>
            <p v-if="layout.groups.length > 1">
                Each service belongs in only one part: duplicate <code>typeName</code> entries make <code>mergeCatalogs</code> throw <code>CatalogConfigError</code>.
            </p>
        </details>

        <details class="assembly-inspect">
            <summary>Look inside a catalog entry</summary>
            <p>The key is the full proto <code>typeName</code>. Its value is a <code>DescService</code> descriptor, not a handler or deployment address.</p>
            <div v-for="(contract, id) in assemblyContracts" :key="id" class="assembly-descriptor" :data-contract="id">
                <strong>{{ contract.typeName }}</strong>
                <dl>
                    <dt>Descriptor</dt>
                    <dd><code>{{ contract.descriptor }}</code></dd>
                    <dt>Unary method</dt>
                    <dd><code>{{ contract.method }}</code></dd>
                    <dt>Request</dt>
                    <dd><code>{{ contract.request }}</code><small>{{ contract.requestFields }}</small></dd>
                    <dt>Response</dt>
                    <dd><code>{{ contract.response }}</code><small>{{ contract.responseFields }}</small></dd>
                </dl>
            </div>
            <p>These examples use unary RPCs. Streaming methods contribute to <code>ConnectumStreamMap</code> instead.</p>
        </details>

        <details class="assembly-transcript">
            <summary>Read all three build layouts</summary>
            <div v-for="item in highlightedLayouts" :key="item.id">
                <p><strong>{{ item.label }}.</strong> {{ item.explanation }}</p>
                <ul>
                    <li v-for="group in item.groups" :key="group.root">
                        <code>{{ group.root }}</code>
                        → <code>buf generate</code> → <code>gen/catalog.gen.ts</code><template v-if="group.dependency"> → <code>{{ group.dependency }}</code></template>
                    </li>
                </ul>
                <div class="assembly-snippet" v-html="item.codeBlock" />
                <p>{{ item.caveat }}</p>
            </div>
        </details>
    </section>
</template>

<style src="../styles/catalog-assembly.css"></style>
