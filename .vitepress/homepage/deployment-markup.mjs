export function deploymentMarkup(svg = '') {
    return `
        <div class="deployment-panel" role="region" aria-label="Service deployment diagrams" aria-describedby="deployment-help">
            <div class="deployment-heading"><span class="deployment-heading__dot" aria-hidden="true"></span><strong>Monolith</strong><span class="deployment-count">1 process</span></div>
            <div class="deployment-stage">${svg}</div>
            <div class="deployment-status" aria-hidden="true"><span></span><span>2 in-process calls · no network</span></div>
            <div class="deployment-controls" role="group" aria-label="Deployment animation controls">
                <progress class="deployment-progress" aria-label="Deployment animation progress"></progress>
                <div class="deployment-steps"></div>
                <div class="deployment-playback"></div>
            </div>
            <p class="deployment-sr-only" id="deployment-help">Illustrative deployment diagrams, not live redeployment. Profile calls Users and Avatars. Local and remote are relative to Profile: its process is blue, and remote processes are amber. Each process also has a Local or Remote label. Select a deployment to pause on its complete diagram. Local calls run in-process; remote calls use configured direct RPC transports.</p>
        </div>
        <div class="home-example__copy deployment-copy">
            <p class="home-eyebrow">Service calls</p>
            <h2 id="service-calls-title">Same code.<br>Different deployments.</h2>
            <p>Keep your Protobuf contracts and service handlers. Run services together as a monolith, separately as microservices, or in a hybrid deployment.</p>
            <p>Call other services with <code>ctx.call()</code>. The same typed call runs in-process or over RPC, depending on your server configuration.</p>
            <div class="home-inline-links">
                <a href="/en/guide/service-communication/service-catalog">Explore service calls →</a>
                <a href="/en/guide/service-communication/resolvers">Configure remote routes →</a>
            </div>
        </div>`;
}
