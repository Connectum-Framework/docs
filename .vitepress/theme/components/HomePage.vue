<script setup lang="ts">
import site from '../../data/site.json';
import ModuleGrid from './ModuleGrid.vue';

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

const serverExample = `import { createServer } from '@connectum/core';
import { Healthcheck } from '@connectum/healthcheck';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { Reflection } from '@connectum/reflection';
import { greeterService } from './services/greeterService.ts';

const server = createServer({
  services: [greeterService],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: createDefaultInterceptors(),
  shutdown: { autoShutdown: true },
});

await server.start();`;
</script>

<template>
    <main class="connectum-home">
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
                    <div><dt>Consumer Node.js</dt><dd>{{ site.consumerNodeVersion }}</dd></div>
                    <div><dt>Status</dt><dd>Beta</dd></div>
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
                <pre><code>{{ serverExample }}</code></pre>
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
                <a href="https://github.com/Connectum-Framework/examples">Examples <span aria-hidden="true">↗</span></a>
                <a href="/en/guide/runtime-compatibility">Runtime compatibility <span aria-hidden="true">→</span></a>
                <a href="/en/migration/">Migration <span aria-hidden="true">→</span></a>
                <a href="/en/contributing/">Contributing <span aria-hidden="true">→</span></a>
                <a href="https://github.com/Connectum-Framework/connectum">GitHub <span aria-hidden="true">↗</span></a>
            </nav>
        </section>
    </main>
</template>
