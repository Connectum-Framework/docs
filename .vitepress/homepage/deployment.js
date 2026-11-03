import { deploymentMarkup } from './deployment-markup.mjs';
import { deploymentFrame, deploymentLayout, deployments, routeKind, services, slideDuration } from './deployment-model.mjs';

export function mountDeployments(section) {
    section.innerHTML = deploymentMarkup();
    const panel = section.querySelector('.deployment-panel');
    const stage = panel.querySelector('.deployment-stage');
    const heading = panel.querySelector('.deployment-heading strong');
    const count = panel.querySelector('.deployment-count');
    const status = panel.querySelector('.deployment-status');
    const statusText = status.lastElementChild;
    const progress = panel.querySelector('progress');
    const steps = panel.querySelector('.deployment-steps');
    const playback = panel.querySelector('.deployment-playback');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 540px)');
    let elapsed = reduce.matches ? slideDuration - 1 : 0;
    let playing = false;
    let interacted = false;
    let started = false;
    let inView = false;
    let origin = 0;
    let raf = 0;
    let active = -1;
    let diagram;

    const svgElement = (tag, attributes = {}, text) => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
        if (text !== undefined) element.textContent = text;
        return element;
    };
    const button = (parent, label, action) => {
        const element = document.createElement('button');
        element.type = 'button';
        element.textContent = label;
        element.addEventListener('click', action);
        parent.append(element);
        return element;
    };
    const icon = (element, kind) => {
        const svg = svgElement('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' });
        const path = svgElement('path', { d: { play: 'M8 5v14l11-7z', pause: 'M6 5h4v14H6zm8 0h4v14h-4z', replay: 'M3 11a9 9 0 1 0 3-6.7M3 3v6h6' }[kind] });
        if (kind === 'replay') {
            for (const [name, value] of Object.entries({ fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }))
                path.setAttribute(name, value);
        } else path.setAttribute('fill', 'currentColor');
        svg.append(path);
        element.replaceChildren(svg);
    };
    const stepButtons = deployments.map((deployment, index) =>
        button(steps, deployment.label, () => {
            interacted = true;
            pause();
            elapsed = (index + 1) * slideDuration - 1;
            render();
        }),
    );
    const play = button(playback, 'Play deployment animation', () => {
        interacted = true;
        if (playing) pause();
        else playFrom(elapsed);
    });
    const replay = button(playback, 'Replay deployment animation', () => {
        interacted = true;
        playFrom(0);
    });
    replay.setAttribute('aria-label', 'Replay deployment animation');
    replay.title = 'Replay deployment animation';
    icon(replay, 'replay');

    function buildDiagram(deployment) {
        const layout = deploymentLayout(deployment, compact.matches);
        const svg = svgElement('svg', { viewBox: `0 0 ${layout.width} ${layout.height}`, role: 'img', 'aria-labelledby': 'deployment-svg-title deployment-svg-desc' });
        const summary = layout.edges
            .map((edge) => `Profile to ${services.find((service) => service.id === edge.target).label}: ${edge.kind === 'local' ? 'in-process' : 'remote RPC'}`)
            .join('. ');
        svg.append(
            svgElement('title', { id: 'deployment-svg-title' }, `${deployment.label}: ${deployment.groups.length} ${deployment.groups.length === 1 ? 'process' : 'processes'}`),
        );
        svg.append(
            svgElement(
                'desc',
                { id: 'deployment-svg-desc' },
                `${layout.groups.map((group) => `${group.kind === 'local' ? 'Local' : 'Remote'} ${group.label.toLowerCase()}: ${group.ids.map((id) => services.find((service) => service.id === id).label).join(' and ')}`).join('. ')}. ${summary}. The contracts and handlers are unchanged.`,
            ),
        );
        const defs = svgElement('defs');
        const marker = svgElement('marker', {
            id: 'deployment-arrow',
            viewBox: '0 0 10 10',
            refX: '9',
            refY: '5',
            markerWidth: '5',
            markerHeight: '5',
            orient: 'auto-start-reverse',
        });
        marker.append(svgElement('path', { d: 'M1 1 9 5 1 9', fill: 'none', stroke: 'context-stroke', 'stroke-width': '1.5' }));
        defs.append(marker);
        svg.append(defs);
        for (const group of layout.groups) {
            svg.append(
                svgElement('rect', {
                    x: group.x,
                    y: group.y,
                    width: group.width,
                    height: group.height,
                    rx: '12',
                    class: `deployment-boundary deployment-boundary--${group.kind}`,
                    'data-services': group.ids.join(','),
                    'data-kind': group.kind,
                }),
            );
            svg.append(svgElement('text', { x: group.x + 12, y: group.y + 19, class: 'deployment-process-label' }, group.label));
            svg.append(
                svgElement(
                    'text',
                    { x: group.x + 12, y: group.y + 36, class: `deployment-process-kind deployment-process-kind--${group.kind}` },
                    group.kind === 'local' ? 'Local' : 'Remote',
                ),
            );
        }
        const edges = layout.edges.map((edge) => {
            const path = svgElement('path', {
                d: edge.path,
                class: `deployment-edge deployment-edge--${edge.kind}`,
                'marker-end': 'url(#deployment-arrow)',
                'data-target': edge.target,
                'data-kind': edge.kind,
            });
            const label = svgElement(
                'text',
                { x: edge.labelX, y: edge.labelY, 'text-anchor': 'middle', class: `deployment-edge-label deployment-edge-label--${edge.kind}` },
                edge.kind === 'local' ? 'local' : 'RPC',
            );
            svg.append(path, label);
            return { ...edge, element: path };
        });
        const cards = layout.cards.map((card) => {
            const group = svgElement('g', { class: `deployment-service deployment-service--${card.id}`, 'data-service': card.id });
            group.append(svgElement('rect', { x: card.x, y: card.y, width: card.width, height: card.height, rx: '9', class: 'deployment-service__surface' }));
            if (!compact.matches) {
                group.append(svgElement('rect', { x: card.x + 14, y: card.y + 17, width: '30', height: '30', rx: '7', class: 'deployment-service__icon' }));
                group.append(svgElement('text', { x: card.x + 29, y: card.y + 37, 'text-anchor': 'middle', class: 'deployment-service__initial' }, card.initial));
            }
            group.append(
                svgElement(
                    'text',
                    { x: card.x + (compact.matches ? card.width / 2 : 56), y: card.y + 29, 'text-anchor': compact.matches ? 'middle' : 'start', class: 'deployment-service__name' },
                    card.label,
                ),
            );
            group.append(
                svgElement(
                    'text',
                    { x: card.x + (compact.matches ? card.width / 2 : 56), y: card.y + 47, 'text-anchor': compact.matches ? 'middle' : 'start', class: 'deployment-service__type' },
                    'service',
                ),
            );
            svg.append(group);
            return { id: card.id, element: group };
        });
        const packet = svgElement('circle', { r: '5', class: 'deployment-packet', 'aria-hidden': 'true' });
        svg.append(packet);
        stage.replaceChildren(svg);
        return { edges, cards, packet };
    }

    function render() {
        const state = deploymentFrame(elapsed, reduce.matches);
        const deployment = deployments[state.index];
        if (active !== state.index || !diagram) {
            active = state.index;
            diagram = buildDiagram(deployment);
            fitTypography();
            heading.textContent = deployment.label;
            count.textContent = `${deployment.groups.length} ${deployment.groups.length === 1 ? 'process' : 'processes'}`;
            stepButtons.forEach((element, index) => {
                element.setAttribute('aria-pressed', String(index === active));
            });
        }
        for (const edge of diagram.edges) {
            const phase = state.target === edge.target ? state.phase : 'idle';
            edge.element.dataset.phase = phase;
            edge.element.setAttribute('marker-start', phase === 'response' ? 'url(#deployment-arrow)' : 'none');
            edge.element.setAttribute('marker-end', phase === 'response' ? 'none' : 'url(#deployment-arrow)');
        }
        for (const card of diagram.cards) {
            card.element.dataset.active = String(state.target === card.id || (card.id === 'profile' && state.target !== null));
        }
        diagram.packet.style.display = state.target ? '' : 'none';
        if (state.target) {
            const edge = diagram.edges.find((edge) => edge.target === state.target);
            const point = edge.element.getPointAtLength(edge.element.getTotalLength() * state.fraction);
            diagram.packet.setAttribute('cx', point.x);
            diagram.packet.setAttribute('cy', point.y);
            diagram.packet.dataset.phase = state.phase;
            const target = services.find((service) => service.id === state.target).label;
            statusText.textContent = `${state.phase === 'request' ? `Profile → ${target}` : `${target} → Profile`} · ${routeKind(deployment, state.target) === 'local' ? 'in-process' : 'remote RPC'}`;
        } else {
            const local = diagram.edges.filter((edge) => edge.kind === 'local').length;
            statusText.textContent = local === 2 ? '2 in-process calls · no network' : local === 0 ? '2 remote calls · direct RPC' : '1 in-process call · 1 remote RPC';
        }
        status.dataset.phase = state.phase;
        progress.max = deployments.length * slideDuration;
        progress.value = state.index * slideDuration + state.local;
        panel.dataset.scene = deployment.id;
        panel.dataset.elapsed = String(Math.floor(elapsed));
        panel.dataset.phase = state.phase;
    }

    function fitTypography() {
        const svg = stage.querySelector('svg');
        if (!svg) return;
        const width = svg.getBoundingClientRect().width;
        if (!width) return;
        const scale = svg.viewBox.baseVal.width / width;
        svg.style.setProperty('--deployment-label-size', `${Math.max(compact.matches ? 14 : 12, 12 * scale)}px`);
        svg.style.setProperty('--deployment-name-size', `${Math.max(compact.matches ? 16 : 15, 14 * scale)}px`);
    }
    const resize = new ResizeObserver(fitTypography);
    resize.observe(panel);

    function updatePlayback() {
        const label = playing ? 'Pause deployment animation' : 'Play deployment animation';
        play.setAttribute('aria-label', label);
        play.title = label;
        play.disabled = reduce.matches;
        replay.disabled = reduce.matches;
        icon(play, playing ? 'pause' : 'play');
        panel.dataset.playing = String(playing);
    }
    function tick(now) {
        if (!playing) return;
        elapsed = (now - origin) % (deployments.length * slideDuration);
        render();
        raf = requestAnimationFrame(tick);
    }
    function playFrom(target) {
        cancelAnimationFrame(raf);
        if (reduce.matches) {
            elapsed = target;
            render();
            return;
        }
        elapsed = target;
        origin = performance.now() - elapsed;
        playing = true;
        updatePlayback();
        render();
        if (inView && !document.hidden) raf = requestAnimationFrame(tick);
    }
    function pause() {
        cancelAnimationFrame(raf);
        playing = false;
        updatePlayback();
    }
    function resumeIfVisible() {
        cancelAnimationFrame(raf);
        if (!playing || !inView || document.hidden) return;
        origin = performance.now() - elapsed;
        raf = requestAnimationFrame(tick);
    }
    const observer = new IntersectionObserver(
        (entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
            if (inView && !started && !interacted && !reduce.matches) {
                started = true;
                playFrom(0);
            } else resumeIfVisible();
        },
        { threshold: 0.35 },
    );
    observer.observe(panel);
    const onCompactChange = () => {
        diagram = null;
        render();
    };
    const onReducedMotion = () => {
        if (!reduce.matches) {
            updatePlayback();
            return;
        }
        pause();
        elapsed = (active + 1) * slideDuration - 1;
        render();
    };
    compact.addEventListener('change', onCompactChange);
    reduce.addEventListener('change', onReducedMotion);
    document.addEventListener('visibilitychange', resumeIfVisible);
    function dispose() {
        pause();
        observer.disconnect();
        resize.disconnect();
        compact.removeEventListener('change', onCompactChange);
        reduce.removeEventListener('change', onReducedMotion);
        document.removeEventListener('visibilitychange', resumeIfVisible);
        window.removeEventListener('pagehide', dispose);
    }
    window.addEventListener('pagehide', dispose, { once: true });
    render();
    updatePlayback();
    if (['#service-calls', '#service-calls-title'].includes(location.hash)) section.scrollIntoView({ block: 'start' });
    return dispose;
}
