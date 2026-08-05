<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import site from '../../data/site.json';
import EcosystemRail from './EcosystemRail.vue';
import ModuleGrid from './ModuleGrid.vue';

const homeRoot = ref<HTMLElement>();
let revealObserver: IntersectionObserver | undefined;

onMounted(async () => {
    await nextTick();
    const sections = homeRoot.value?.querySelectorAll<HTMLElement>('.home-section');
    if (!sections || window.location.hash || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    for (const section of sections) section.classList.add('home-reveal');
    homeRoot.value?.setAttribute('data-motion', 'ready');
    revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-visible');
            revealObserver?.unobserve(entry.target);
        }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    for (const section of sections) revealObserver.observe(section);
});

onBeforeUnmount(() => revealObserver?.disconnect());

const goals = [
    {
        label: 'New to Connectum',
        title: 'Build a first service',
        description: 'Go from an empty directory to a verified gRPC call with a focused, linear tutorial.',
        link: '/en/guide/quickstart',
        action: 'Start the tutorial',
    },
    {
        label: 'Building a capability',
        title: 'Solve a service task',
        description: 'Add validation, communication, events, authentication, or testing without reading the whole framework.',
        link: '/en/guide/about#choose-your-path',
        action: 'Browse guides',
    },
    {
        label: 'Operating services',
        title: 'Prepare for production',
        description: 'Connect health, observability, graceful shutdown, containers, Kubernetes, and gateways.',
        link: '/en/guide/production/kubernetes',
        action: 'Explore operations',
    },
    {
        label: 'Know what you need',
        title: 'Find an exact option',
        description: 'Jump by module or symbol into the generated API, compatibility matrix, or migration guidance.',
        link: '/en/reference/',
        action: 'Open reference',
    },
] as const;

const lifecycle = [
    ['Define', 'Proto contracts and generated types'],
    ['Run', 'Server lifecycle and transport'],
    ['Protect', 'Validation, auth, and resilience'],
    ['Observe', 'Traces, metrics, and logs'],
    ['Operate', 'Health, shutdown, and deployment'],
] as const;

</script>

<template>
    <main ref="homeRoot" class="connectum-home">
        <section class="home-hero" aria-labelledby="home-title">
            <div class="home-hero__copy">
                <p class="home-eyebrow">gRPC + ConnectRPC for Node.js</p>
                <h1 id="home-title">A clear path from your first RPC to production.</h1>
                <p class="home-hero__lead">
                    Connectum gives TypeScript teams a consistent service runtime for contracts,
                    middleware, security, observability, and operations—without hiding the controls.
                </p>
                <div class="home-actions">
                    <a class="home-button home-button--primary" href="/en/guide/quickstart">Build your first service</a>
                    <a class="home-button home-button--secondary" href="/en/reference/">Find an API</a>
                </div>
                <dl class="home-support" aria-label="Documentation support information">
                    <div><dt>Docs</dt><dd>{{ site.documentedVersion }}</dd></div>
                    <div>
                        <dt>Compatibility</dt>
                        <dd><a href="/en/guide/runtime-compatibility">Runtime matrix <span aria-hidden="true">→</span></a></dd>
                    </div>
                </dl>
            </div>
            <div class="home-hero__art" aria-hidden="true"></div>
        </section>

        <section class="home-section home-intents" aria-labelledby="start-by-goal">
            <div class="home-section__heading">
                <p class="home-eyebrow">Start by goal</p>
                <h2 id="start-by-goal">Use the shortest route to your outcome.</h2>
            </div>
            <div class="home-goal-grid">
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
                    <h2 id="lifecycle-title">Compose only the capabilities you need.</h2>
                </div>
                <p>
                    The framework keeps lifecycle and registration predictable while modules remain
                    explicit. Begin with the server; add production behavior as the service grows.
                </p>
            </div>
            <ol class="lifecycle-track">
                <li v-for="([title, detail], index) in lifecycle" :key="title">
                    <span class="lifecycle-track__number">0{{ index + 1 }}</span>
                    <strong>{{ title }}</strong>
                    <span>{{ detail }}</span>
                </li>
            </ol>
        </section>

        <section class="home-section home-ecosystem" aria-labelledby="ecosystem-title">
            <div class="home-section__heading home-section__heading--split">
                <div>
                    <p class="home-eyebrow">Fits your stack</p>
                    <h2 id="ecosystem-title">One runtime across your service ecosystem.</h2>
                </div>
                <p>
                    Build on ConnectRPC and gRPC, operate with cloud-native tooling, and choose the
                    brokers and runtimes that fit each service.
                </p>
            </div>
            <EcosystemRail />
        </section>

        <section class="home-section home-example" aria-labelledby="example-title">
            <div class="home-example__copy">
                <p class="home-eyebrow">The central primitive</p>
                <h2 id="example-title">A server whose production behavior stays visible.</h2>
                <p>
                    Services, protocols, middleware, and shutdown policy meet at
                    <code>createServer()</code>. The full tutorial defines the proto, implements the
                    handler, starts the service, and verifies a real RPC.
                </p>
                <div class="home-inline-links">
                    <a href="/en/guide/quickstart">Follow the full tutorial →</a>
                    <a href="/en/api/@connectum/core/types/interfaces/CreateServerOptions">CreateServerOptions →</a>
                </div>
            </div>
            <div class="home-code" aria-label="TypeScript createServer example">
                <div class="home-code__bar"><span></span><span></span><span></span><strong>server.ts</strong></div>
                <div class="home-code__highlight">
                    <slot name="server-example"></slot>
                </div>
            </div>
        </section>

        <section class="home-section home-modules" aria-labelledby="modules-title">
            <div class="home-section__heading home-section__heading--split">
                <div>
                    <p class="home-eyebrow">Explore modules</p>
                    <h2 id="modules-title">Navigate by capability, not dependency graph.</h2>
                </div>
                <p>Each module links learning material, focused configuration, and its generated API surface.</p>
            </div>
            <ModuleGrid />
            <p class="home-section__more"><a href="/en/packages/">Compare all packages →</a></p>
        </section>

        <section class="home-section home-resources" aria-labelledby="resources-title">
            <div>
                <p class="home-eyebrow">Keep moving</p>
                <h2 id="resources-title">From evaluation to operation.</h2>
            </div>
            <nav aria-label="Connectum resources">
                <div class="home-resources__column" aria-label="Documentation links">
                    <a href="/en/guide/runtime-compatibility"><span>Runtime compatibility</span><span aria-hidden="true">→</span></a>
                    <a href="/en/migration/"><span>Migration</span><span aria-hidden="true">→</span></a>
                    <a href="/en/contributing/"><span>Contributing</span><span aria-hidden="true">→</span></a>
                </div>
                <div class="home-resources__column" aria-label="External project links">
                    <a class="no-icon" href="https://github.com/Connectum-Framework/examples" target="_blank" rel="noreferrer"><span>Examples</span><span aria-hidden="true">↗</span></a>
                    <a class="no-icon" href="https://github.com/Connectum-Framework/connectum" target="_blank" rel="noreferrer"><span>GitHub</span><span aria-hidden="true">↗</span></a>
                </div>
            </nav>
        </section>
    </main>
</template>
