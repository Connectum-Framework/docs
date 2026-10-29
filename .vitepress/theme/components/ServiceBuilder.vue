<!-- biome-ignore-all lint/a11y/noNoninteractiveTabindex: scrollable code and command panes must be reachable from the keyboard. -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef } from 'vue';
import { projectArchive } from '../../builder/archive.ts';
import type { DiffHighlighter } from '../../builder/highlight.ts';
import {
    adapterDetails,
    buildProject,
    compactDiff,
    defaultSelection,
    featureDetails,
    nameError,
    PROTO_PATH,
    packageManagers,
    previewFiles,
    projectTree,
    provenance,
    runCommands,
    scaffoldCommand,
    visiblePreviewFiles,
} from '../../builder/model.ts';
import type { BuilderResilience, BuilderRuntime } from '../../builder/types.ts';
import { isPackageManager, setPackageManager } from '../packageManager.ts';
import { isRuntime, setRuntime } from '../runtime.ts';

const selection = reactive(defaultSelection());
const validationError = computed(() => nameError(selection.name));
const project = computed(() => (validationError.value ? null : buildProject(selection)));
const baseline = buildProject(defaultSelection());
const requestedFile = ref('src/server.ts');
const nodePackageManager = ref<'pnpm' | 'npm'>('pnpm');
const fileNavigation = ref<HTMLElement>();
const codeRegion = ref<HTMLElement>();
const status = ref('');
const modified = computed(() => (project.value ? previewFiles(baseline, project.value) : []));
const paths = computed(() => (project.value ? visiblePreviewFiles(project.value) : []));
const tree = computed(() => projectTree(paths.value));
const activeFile = computed(() => (paths.value.includes(requestedFile.value) ? requestedFile.value : (paths.value[0] ?? 'src/server.ts')));
const isPreview = provenance.releaseStatus === 'preview';
const currentCode = computed(() => project.value?.[activeFile.value] ?? '');
const rows = computed(() => compactDiff(baseline[activeFile.value] ?? '', currentCode.value));
const highlighter = shallowRef<DiffHighlighter>();
const syntax = computed(() => highlighter.value?.({ path: activeFile.value, before: baseline[activeFile.value] ?? '', after: currentCode.value, rows: rows.value }));
const copiedDiff = computed(() => rows.value.map((line) => `${line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' '} ${line.text}`).join('\n'));
const command = computed(() => (validationError.value ? '' : scaffoldCommand(selection)));
const start = computed(() => (validationError.value ? '' : runCommands(selection)));
const selectedCount = computed(() => featureDetails.filter((feature) => selection[feature.id]).length + selection.resilience.length);
const resilience = [
    { id: 'timeout', label: 'Timeout', description: 'Bound the time spent on a request.' },
    { id: 'retry', label: 'Retry', description: 'Retry eligible failures.' },
    { id: 'circuitBreaker', label: 'Circuit breaker', description: 'Stop calls while a dependency is failing.' },
    { id: 'bulkhead', label: 'Bulkhead', description: 'Limit concurrent work.' },
] as const;
let archiveUrl: string | undefined;
let disposed = false;

function change(apply: () => void, file = 'src/server.ts') {
    apply();
    requestedFile.value = file;
    status.value = '';
    void nextTick(revealFile);
}

function revealFile() {
    const navigation = fileNavigation.value;
    const button = navigation?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (navigation && button) {
        const container = navigation.getBoundingClientRect();
        const selected = button.getBoundingClientRect();
        if (selected.top < container.top) navigation.scrollTop += selected.top - container.top;
        else if (selected.bottom > container.bottom) navigation.scrollTop += selected.bottom - container.bottom;
    }
    if (codeRegion.value) codeRegion.value.scrollTop = codeRegion.value.scrollLeft = 0;
}

function changeRuntime(runtime: BuilderRuntime) {
    change(() => {
        selection.runtime = runtime;
        selection.packageManager = runtime === 'bun' ? 'bun' : nodePackageManager.value;
        setRuntime(runtime);
        setPackageManager(selection.packageManager);
    }, 'package.json');
}

function changeName(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    change(() => {
        selection.name = target.value;
    }, 'package.json');
}

function toggleFeature(id: (typeof featureDetails)[number]['id']) {
    const feature = featureDetails.find((feature) => feature.id === id);
    change(() => {
        selection[id] = !selection[id];
    }, feature?.file);
}

function changeNodeExec(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement) || (target.value !== 'raw' && target.value !== 'tsx')) return;
    const value = target.value;
    change(() => {
        selection.nodeExec = value;
    }, 'package.json');
}

function changeAdapter(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    const value = target.value;
    if (value !== 'nats' && value !== 'kafka' && value !== 'redpanda' && value !== 'redis' && value !== 'amqp') return;
    change(() => {
        selection.adapter = value;
    }, 'src/greeterEventBus.ts');
}

function toggleResilience(id: BuilderResilience) {
    change(() => {
        selection.resilience = selection.resilience.includes(id) ? selection.resilience.filter((value) => value !== id) : [...selection.resilience, id];
    });
}

async function copy(text: string, label: string) {
    try {
        await navigator.clipboard.writeText(text);
        status.value = `${label} copied.`;
    } catch {
        status.value = 'Clipboard unavailable. Select the text and copy it manually.';
    }
}

function download() {
    if (!project.value) return;
    try {
        if (archiveUrl) URL.revokeObjectURL(archiveUrl);
        archiveUrl = URL.createObjectURL(new Blob([projectArchive(selection.name, project.value)], { type: 'application/zip' }));
        const link = document.createElement('a');
        link.href = archiveUrl;
        link.download = `${selection.name}.zip`;
        link.click();
        status.value = 'Project download started.';
    } catch {
        status.value = 'The archive could not be created. The commands and file previews are still available.';
    }
}

function reset() {
    change(() => Object.assign(selection, defaultSelection()));
    setRuntime(selection.runtime);
    setPackageManager(selection.packageManager);
    nodePackageManager.value = 'pnpm';
}

onMounted(() => {
    const runtime = document.documentElement.dataset.runtime;
    const pm = document.documentElement.dataset.pm;
    if (isRuntime(runtime)) selection.runtime = runtime;
    if (isPackageManager(pm) && pm !== 'bun') nodePackageManager.value = pm;
    selection.packageManager = selection.runtime === 'bun' ? 'bun' : nodePackageManager.value;
    setPackageManager(selection.packageManager);
    // keep initial code visible while loading only the four grammars this preview needs.
    void import('../../builder/highlight.ts')
        .then((module) => module.createDiffHighlighter())
        .then((value) => {
            if (!disposed) highlighter.value = value;
        })
        .catch(() => {
            if (!disposed) status.value = 'Syntax highlighting could not load. The diff and download remain available.';
        });
});
onBeforeUnmount(() => {
    disposed = true;
    if (archiveUrl) URL.revokeObjectURL(archiveUrl);
});
</script>

<template>
    <main class="service-builder" aria-labelledby="builder-title">
        <header class="builder-intro">
            <a class="builder-back" href="/en/">← Connectum</a>
            <div class="builder-intro__heading">
                <div>
                    <p class="builder-eyebrow">Your service, your choices</p>
                    <h1 id="builder-title">Start small.<br>Add what you need.</h1>
                </div>
                <p>Choose a runtime and a few capabilities. Inspect the real scaffold, see each change, and take the project with you.</p>
            </div>
        </header>

        <div class="builder-workspace">
            <section class="builder-options" aria-labelledby="builder-options-title">
                <div class="builder-section-heading">
                    <h2 id="builder-options-title">Configure your service</h2>
                    <button type="button" class="builder-text-button" @click="reset">Reset</button>
                </div>
                <label class="builder-input-label" for="builder-name">Project name</label>
                <input
                    id="builder-name"
                    class="builder-name"
                    :value="selection.name"
                    maxlength="100"
                    spellcheck="false"
                    autocomplete="off"
                    :aria-invalid="Boolean(validationError)"
                    aria-describedby="builder-name-help"
                    @input="changeName"
                >
                <p id="builder-name-help" class="builder-field-help" :class="{ 'builder-field-help--error': validationError }">
                    {{ validationError ?? 'A new folder and package name. Lowercase, for example payments-api.' }}
                </p>

                <fieldset class="builder-fieldset">
                    <legend>Runtime</legend>
                    <div class="builder-choice-row">
                        <!-- biome-ignore lint/a11y/noLabelWithoutControl: vue interpolates the name of the wrapped radio. -->
                        <label v-for="runtime in (['node', 'bun'] as const)" :key="runtime" class="builder-radio" :class="{ 'is-selected': selection.runtime === runtime }"
                            ><input type="radio" name="builder-runtime" :value="runtime" :checked="selection.runtime === runtime" @change="changeRuntime(runtime)">
                            <span>{{ runtime === 'node' ? 'Node.js' : 'Bun' }}</span></label
                        >
                    </div>
                </fieldset>
                <div v-if="selection.runtime === 'node'" class="builder-execution">
                    <label for="builder-node-exec">TypeScript execution</label
                    ><select id="builder-node-exec" :value="selection.nodeExec" @change="changeNodeExec">
                        <option value="raw">Native TypeScript · Node.js ≥25.2</option>
                        <option value="tsx">tsx · Node.js ≥22.13</option>
                    </select>
                    <p class="builder-field-help">Use a maintained Node.js release that meets this requirement.</p>
                </div>

                <fieldset class="builder-fieldset">
                    <legend>Package manager <span>{{ selection.runtime === 'bun' ? 'Bun runtime uses bun' : 'For Node.js' }}</span></legend>
                    <div class="builder-choice-row">
                        <!-- biome-ignore lint/a11y/noLabelWithoutControl: vue interpolates the name of the wrapped radio. -->
                        <label v-for="pm in packageManagers(selection.runtime)" :key="pm" class="builder-radio" :class="{ 'is-selected': selection.packageManager === pm }"
                            ><input
                                type="radio"
                                name="builder-pm"
                                :value="pm"
                                :checked="selection.packageManager === pm"
                                :disabled="selection.runtime === 'bun'"
                                @change="change(() => { if (pm !== 'bun') nodePackageManager = pm; selection.packageManager = pm; setPackageManager(pm); }, 'package.json')"
                            ><span>{{ pm }}</span></label
                        >
                    </div>
                </fieldset>

                <fieldset class="builder-fieldset">
                    <legend>Add capabilities <span>{{ selectedCount }} selected</span></legend>
                    <div class="builder-feature-grid">
                        <!-- biome-ignore lint/a11y/noLabelWithoutControl: vue interpolates the wrapped checkbox's label. -->
                        <label v-for="feature in featureDetails" :key="feature.id" class="builder-feature" :class="{ 'is-selected': selection[feature.id] }"
                            ><input type="checkbox" :checked="selection[feature.id]" @change="toggleFeature(feature.id)">
                            <span><strong>{{ feature.label }}</strong><small>{{ feature.description }}</small></span></label
                        >
                    </div>
                </fieldset>
                <div v-if="selection.events" class="builder-execution">
                    <label for="builder-adapter">Event transport</label
                    ><select id="builder-adapter" :value="selection.adapter" @change="changeAdapter">
                        <option v-for="(adapter, id) in adapterDetails" :key="id" :value="id">{{ adapter.label }}</option>
                    </select>
                    <p class="builder-field-help">{{ adapterDetails[selection.adapter].requirement }} The CLI does not start a broker.</p>
                </div>

                <details class="builder-advanced">
                    <summary>Resilience <span>Opt-in defaults</span></summary>
                    <div class="builder-resilience">
                        <!-- biome-ignore lint/a11y/noLabelWithoutControl: vue interpolates the wrapped checkbox's label. -->
                        <label v-for="item in resilience" :key="item.id"
                            ><input type="checkbox" :checked="selection.resilience.includes(item.id)" @change="toggleResilience(item.id)">
                            <span><strong>{{ item.label }}</strong><small>{{ item.description }}</small></span></label
                        >
                    </div>
                    <p class="builder-field-help">Fallback is intentionally not a checkbox: it needs your application-specific handler.</p>
                </details>
                <div class="builder-included">
                    <strong>Already in the base</strong>
                    <p>
                        Greeter service, health checks, reflection, graceful shutdown and a validation interceptor.
                        <a href="/en/guide/validation">Add constraints in your proto →</a>
                    </p>
                </div>
            </section>

            <section class="builder-result" aria-labelledby="builder-result-title">
                <div class="builder-section-heading">
                    <h2 id="builder-result-title">See what changes</h2>
                    <span class="builder-file-count">{{ modified.length }} changed {{ modified.length === 1 ? 'file' : 'files' }}</span>
                </div>
                <p class="builder-change-summary" aria-live="polite">
                    {{ modified.length ? 'Everything you add to the base service — not just your last action.' : 'Your base service. Select options to see what changes.' }}
                </p>
                <div class="builder-code-window">
                    <div class="builder-code-toolbar">
                        <strong>{{ activeFile }}</strong>
                        <button type="button" class="builder-copy-file" :disabled="!project" @click="copy(copiedDiff, 'Diff')">Copy diff</button>
                    </div>
                    <div class="builder-code-content">
                        <nav v-if="project" ref="fileNavigation" class="builder-files" aria-label="Application files">
                            <template v-for="entry in tree" :key="entry.path">
                                <span v-if="entry.kind === 'directory'" class="builder-directory" :style="{ paddingLeft: `${10 + entry.depth * 8}px` }">{{ entry.label }}</span>
                                <button
                                    v-else
                                    type="button"
                                    :aria-label="entry.path"
                                    :aria-pressed="activeFile === entry.path"
                                    :class="{ 'builder-file--added': baseline[entry.path] === undefined, 'builder-file--modified': baseline[entry.path] !== undefined && modified.includes(entry.path) }"
                                    :aria-description="baseline[entry.path] === undefined ? 'New file' : modified.includes(entry.path) ? 'Modified from the base service' : 'Base service'"
                                    :style="{ paddingLeft: `${9 + entry.depth * 8}px` }"
                                    @click="requestedFile = entry.path; nextTick(revealFile)"
                                >
                                    <span class="builder-file-marker" aria-hidden="true"
                                        >{{ baseline[entry.path] === undefined ? '+' : modified.includes(entry.path) ? 'M' : '·' }}</span
                                    >
                                    <span class="builder-file-label">{{ entry.label }}</span>
                                </button>
                            </template>
                        </nav>
                        <div v-if="validationError" class="builder-invalid" role="status">Choose a valid project name to preview or download your files.</div>
                        <!-- biome-ignore lint/a11y/useSemanticElements: the labelled pre preserves copyable code and lets keyboard users scroll the pane. -->
                        <pre
                            v-else
                            class="builder-code"
                            ref="codeRegion"
                            role="region"
                            tabindex="0"
                            :aria-label="`${activeFile}, changes from the base service. Scroll to read all changes.`"
                        ><code><span v-for="(line, index) in rows" :key="`${activeFile}:${index}`" class="builder-code-line" :class="`builder-code-line--${line.kind}`"><span class="builder-line-number" aria-hidden="true">{{ line.kind === 'added' ? '+' : line.kind === 'removed' ? '−' : line.number }}</span><span v-if="line.kind === 'added' || line.kind === 'removed'" class="builder-sr-only">{{ line.kind === 'added' ? 'Added: ' : 'Removed: ' }}</span><template v-if="syntax?.[index]?.length"><span v-for="(token, tokenIndex) in syntax[index]" :key="tokenIndex" class="builder-syntax-token" :style="{ '--builder-syntax-light': token.light, '--builder-syntax-dark': token.dark }">{{ token.content }}</span></template><template v-else>{{ line.text || ' ' }}</template></span></code></pre>
                    </div>
                    <div class="builder-diff-legend">
                        <span>+ Added</span><span>− Removed</span><span>Compared with the base service</span>
                    </div>
                </div>

                <section class="builder-contract" aria-labelledby="builder-contract-title">
                    <div>
                        <p class="builder-eyebrow">One contract edit</p>
                        <h3 id="builder-contract-title">Make a method public. Or keep it private.</h3>
                        <p>The auth module adds the JWT and authorization wiring. Then a single proto option decides whether <code>SayHello</code> is public.</p>
                    </div>
                    <label class="builder-contract-choice"
                        ><input
                            type="checkbox"
                            :checked="selection.publicHello"
                            :disabled="!selection.auth"
                            @change="change(() => { selection.publicHello = !selection.publicHello; }, PROTO_PATH)"
                        ><span
                            ><strong>Public SayHello</strong
                            ><small
                                >{{ !selection.auth ? 'Enable JWT authentication above to try this edit.' : selection.publicHello ? 'SayHello is public. SayGoodbye stays denied until you add an authorization rule.' : 'SayHello accepts a valid JWT through requires: {}. Downloaded tests cover authenticated success and rejected credentials.' }}</small
                            ></span
                        ></label
                    >
                    <p v-if="selection.auth" class="builder-field-help">
                        Configure <code>JWKS_URI</code>, <code>JWT_ISSUER</code> and <code>JWT_AUDIENCE</code> for authenticated calls. <a href="/en/guide/auth/jwt">JWT setup →</a>
                    </p>
                </section>
            </section>
        </div>

        <section class="builder-takeaway" aria-labelledby="builder-takeaway-title">
            <div class="builder-takeaway__intro">
                <p class="builder-eyebrow">Take it from here</p>
                <h2 id="builder-takeaway-title">Your starting point.<br>Not a black box.</h2>
                <p>The preview focuses on application changes. The download includes the complete project: configuration, contracts, tests, Docker and support files.</p>
                <button type="button" class="builder-primary" :disabled="!project" @click="download">Download project .zip <span aria-hidden="true">↓</span></button>
                <p class="builder-download-note">For the 1.3 release line. Dependencies are installed on your machine, not bundled.</p>
            </div>
            <div class="builder-commands">
                <div class="builder-command-heading">
                    <h3>Or scaffold with the CLI</h3>
                    <button type="button" :disabled="!command" @click="copy(command, 'CLI command')">Copy command</button>
                </div>
                <!-- biome-ignore lint/a11y/useSemanticElements: the labelled pre preserves command whitespace and supports keyboard scrolling. -->
                <pre tabindex="0" role="region" aria-label="Scaffold command"><code>{{ command || 'Enter a valid project name.' }}</code></pre>
                <p v-if="selection.auth && !selection.publicHello" class="builder-customization-note">
                    The CLI creates a public SayHello. The download includes your contract edit and matching tests. If you use this command instead, replace
                    <code>public: true</code>
                    with <code>requires: { }</code> in the method option.
                </p>
                <p v-else class="builder-field-help">
                    The CLI command covers the selected modules.<template v-if="isPreview"> It requires CLI {{ provenance.cliVersion }}, which is not published yet.</template>
                </p>
                <div class="builder-command-heading">
                    <h3>After creating the project</h3>
                    <button type="button" :disabled="!start" @click="copy(start, 'Run commands')">Copy steps</button>
                </div>
                <!-- biome-ignore lint/a11y/useSemanticElements: the labelled pre preserves command whitespace and supports keyboard scrolling. -->
                <pre tabindex="0" role="region" aria-label="Install and start commands"><code>{{ start || 'Enter a valid project name.' }}</code></pre>
                <a href="/en/guide/scaffolding">Read the scaffolding guide →</a>
            </div>
        </section>
        <p class="builder-feedback" role="status" aria-live="polite">{{ status }}</p>
        <footer class="builder-provenance">
            Generated by the CLI's own transform, not a second set of templates.
            <!-- biome-ignore lint/a11y/useValidAnchor: vue binds the real source URL through :href. -->
            <a :href="provenance.sourceUrl" target="_blank" rel="noreferrer">Source {{ provenance.sourceCommit.slice(0, 7) }} ↗</a>
            · Base example {{ provenance.baseRef }}.
        </footer>
    </main>
</template>

<style src="../styles/service-builder.css"></style>
