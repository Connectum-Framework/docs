<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
// biome-ignore lint/correctness/noUnusedImports: the Vue template renders the documented version.
import site from '../../data/site.json';
// biome-ignore lint/correctness/noUnusedImports: the Vue template mounts this component.
import EcosystemRail from './EcosystemRail.vue';
// biome-ignore lint/correctness/noUnusedImports: the Vue template mounts this component.
import HomeCodeWalkthrough from './HomeCodeWalkthrough.vue';
// biome-ignore lint/correctness/noUnusedImports: the Vue template mounts this component.
import HomeDeployments from './HomeDeployments.vue';
// biome-ignore lint/correctness/noUnusedImports: the Vue template mounts this component.
import ModuleGrid from './ModuleGrid.vue';

const homeRoot = ref<HTMLElement>();
let revealObserver: IntersectionObserver | undefined;

onMounted(async () => {
    await nextTick();
    const sections = homeRoot.value?.querySelectorAll<HTMLElement>('.home-section');
    if (!sections || window.location.hash || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    for (const section of sections) section.classList.add('home-reveal');
    homeRoot.value?.setAttribute('data-motion', 'ready');
    revealObserver = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('is-visible');
                revealObserver?.unobserve(entry.target);
            }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );
    for (const section of sections) revealObserver.observe(section);
});

onBeforeUnmount(() => revealObserver?.disconnect());

// biome-ignore lint/correctness/noUnusedVariables: the Vue template iterates these goal links.
const goals = [
    {
        label: 'Your first service',
        title: 'Build a protected RPC',
        description: 'Scaffold a project, add a Protobuf method and check calls with and without a JWT.',
        link: '/en/guide/quickstart',
        action: 'Follow the quickstart',
    },
    {
        label: 'Connecting services',
        title: 'Choose how services communicate',
        description: 'Compare typed RPC calls and events, then choose local or remote routing.',
        link: '/en/guide/communication',
        action: 'Communication guides',
    },
    {
        label: 'Deploying a service',
        title: 'Choose a deployment setup',
        description: 'Package the service for containers and find guidance for Kubernetes, gateways and service meshes.',
        link: '/en/guide/deploy',
        action: 'Deployment guides',
    },
    {
        label: 'Exact API',
        title: 'Find an exact option',
        description: 'Look up exported functions, TypeScript interfaces and configuration fields in the generated API.',
        link: '/en/api/',
        action: 'Open the API',
    },
] as const;

// biome-ignore lint/correctness/noUnusedVariables: the Vue template iterates these lifecycle entries.
const lifecycle = [
    ['Define', 'Proto contracts and generated types'],
    ['Run', 'Server lifecycle and transport'],
    ['Protect', 'Configured validation, auth and resilience'],
    ['Observe', 'Traces, metrics, and logs'],
    ['Operate', 'Health, shutdown, and deployment'],
] as const;
</script>

<template>
    <main ref="homeRoot" class="connectum-home">
        <section class="home-hero" aria-labelledby="home-title">
            <div class="home-hero__copy">
                <p class="home-eyebrow">Microservices framework</p>
                <h1 id="home-title">Proto is the single source of truth</h1>
                <p class="home-hero__lead">Connectum provides a TypeScript service runtime for proto contracts, request middleware, security, observability, and operations.</p>
                <div class="home-actions">
                    <a class="home-button home-button--primary" href="/en/guide/about">Get started</a>
                    <a class="home-button home-button--secondary" href="/en/guide/production/architecture">Explore architecture</a>
                </div>
                <dl class="home-support" aria-label="Documentation support information">
                    <div>
                        <dt>Docs</dt>
                        <dd>{{ site.documentedVersion }}</dd>
                    </div>
                    <div>
                        <dt>Compatibility</dt>
                        <dd>
                            <a href="/en/guide/runtime-compatibility-details#compatibility-matrix">Runtime matrix <span aria-hidden="true">→</span></a>
                        </dd>
                    </div>
                </dl>
            </div>
            <div class="home-hero__art" aria-hidden="true"></div>
        </section>

        <section class="home-section home-ecosystem" aria-labelledby="ecosystem-title">
            <div class="home-section__heading home-section__heading--split">
                <div>
                    <p class="home-eyebrow">Fits your stack</p>
                    <h2 id="ecosystem-title">Build on ConnectRPC and Protobuf.</h2>
                </div>
                <p>
                    ConnectRPC supplies the RPC layer. Connectum adds a shared server lifecycle and optional modules for security, telemetry and events.
                </p>
            </div>
            <EcosystemRail />
            <p class="home-section__more">
                <a href="/en/guide/about#what-connectum-owns">See what Connectum owns →</a>
                · <a href="/en/guide/runtime-compatibility-details">Runtime requirements and limits →</a>
            </p>
        </section>

        <section class="home-section home-example" aria-labelledby="example-title">
            <div class="home-example__copy">
                <p class="home-eyebrow">From contract to handler</p>
                <h2 id="example-title">Implement your contract in TypeScript.</h2>
                <p>
                    Define the API in Protobuf, generate its types and implement the handlers as ordinary functions. Register services, middleware and protocols with
                    <code>createServer()</code>.
                </p>
                <div class="home-inline-links">
                    <a href="/en/guide/quickstart-manual">Build a service step by step →</a>
                    <a href="/en/api/@connectum/core/types/interfaces/CreateServerOptions">CreateServerOptions →</a>
                </div>
            </div>
            <HomeCodeWalkthrough>
                <slot name="server-example" />
            </HomeCodeWalkthrough>
        </section>

        <HomeDeployments />

        <section class="home-section home-intents" aria-labelledby="start-by-goal">
            <div class="home-section__heading">
                <p class="home-eyebrow">Start by goal</p>
                <h2 id="start-by-goal">Choose your next step.</h2>
            </div>
            <div class="home-goal-grid">
                <!-- biome-ignore lint/a11y/useValidAnchor: Vue binds the real destination through :href. -->
                <a v-for="goal in goals" :key="goal.title" class="home-goal-card" :href="goal.link">
                    <span class="home-goal-card__label">{{ goal.label }}</span>
                    <strong>{{ goal.title }}</strong>
                    <span>{{ goal.description }}</span>
                    <span class="home-card-action">{{ goal.action }} <span aria-hidden="true">→</span></span>
                </a>
            </div>
        </section>

        <section class="home-section home-lifecycle" aria-labelledby="lifecycle-title">
            <div class="home-section__heading home-section__heading--split">
                <div>
                    <p class="home-eyebrow">One service lifecycle</p>
                    <h2 id="lifecycle-title">Add capabilities through explicit modules.</h2>
                </div>
                <p>
                    Use the same startup and shutdown model across services, with only the modules each service needs. Your application keeps its database, business logic and
                    dependency wiring.
                </p>
            </div>
            <ol class="lifecycle-track">
                <li v-for="([ title, detail ], index) in lifecycle" :key="title">
                    <span class="lifecycle-track__number">0{{ index + 1 }}</span>
                    <strong>{{ title }}</strong>
                    <span>{{ detail }}</span>
                </li>
            </ol>
            <p>
                For a small RPC endpoint, or when your existing setup already covers these needs, ConnectRPC alone may be enough.
                <a href="/en/guide/about">Decide whether Connectum fits your service.</a>
            </p>
        </section>

        <section class="home-section home-modules" aria-labelledby="modules-title">
            <div class="home-section__heading home-section__heading--split">
                <div>
                    <p class="home-eyebrow">Explore modules</p>
                    <h2 id="modules-title">Find modules by capability.</h2>
                </div>
                <p>Choose a capability, then open its Guide or generated API.</p>
            </div>
            <ModuleGrid />
            <p class="home-section__more"><a href="/en/guide/production/architecture#extension-seams">Understand module boundaries →</a></p>
        </section>

        <section class="home-section home-resources" aria-labelledby="resources-title">
            <div>
                <p class="home-eyebrow">Keep moving</p>
                <h2 id="resources-title">From evaluation to operation.</h2>
            </div>
            <nav aria-label="Connectum resources">
                <section class="home-resources__column" aria-label="Documentation links">
                    <a href="/en/guide/runtime-compatibility"><span>Runtime compatibility</span><span aria-hidden="true">→</span></a>
                    <a href="/en/migration/"><span>Migration</span><span aria-hidden="true">→</span></a>
                    <a href="/en/contributing/"><span>Contributing</span><span aria-hidden="true">→</span></a>
                </section>
                <section class="home-resources__column" aria-label="External project links">
                    <a class="no-icon" href="https://github.com/Connectum-Framework/examples" target="_blank" rel="noreferrer"
                        ><span>Examples</span><span class="home-resources__external-arrow" aria-hidden="true">→</span></a
                    >
                    <a class="no-icon" href="https://github.com/Connectum-Framework/connectum" target="_blank" rel="noreferrer"
                        ><span>GitHub</span><span class="home-resources__external-arrow" aria-hidden="true">→</span></a
                    >
                </section>
            </nav>
        </section>
    </main>
</template>
