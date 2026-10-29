import { lineReveal } from './motion.mjs';
import { commandTyped, loopFrame, selectedScene } from './player.mjs';

export function mountPrototype(panel, data) {
    if (!panel || panel.classList.contains('motion-native')) return;
    const originalHeight = panel.getBoundingClientRect().height;

    const surface = document.createElement('div');
    surface.className = 'motion-surface';
    const bar = document.createElement('div');
    bar.className = 'motion-bar';
    for (let index = 0; index < 3; index++) {
        const dot = document.createElement('span');
        dot.className = 'motion-dot';
        dot.setAttribute('aria-hidden', 'true');
        bar.append(dot);
    }
    const filename = document.createElement('strong');
    filename.className = 'motion-file';
    const counter = document.createElement('span');
    counter.className = 'motion-counter';
    bar.append(filename, counter);
    const body = document.createElement('div');
    body.className = 'motion-body';
    body.tabIndex = 0;
    body.setAttribute('role', 'region');
    body.setAttribute('aria-label', 'Animated code example. Scroll horizontally on narrow screens.');
    surface.append(bar, body);

    const controls = document.createElement('div');
    controls.className = 'motion-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Code animation controls');
    const steps = document.createElement('div');
    steps.className = 'motion-steps';
    const playback = document.createElement('div');
    playback.className = 'motion-playback';
    const progress = document.createElement('progress');
    progress.className = 'motion-progress';
    progress.max = data.durationInFrames;
    progress.value = 0;
    progress.setAttribute('aria-label', 'Animation progress');
    controls.append(steps, playback, progress);

    const help = document.createElement('p');
    help.id = 'motion-help';
    help.className = 'motion-help';
    help.textContent =
        'Text animation of an executed example, not a live terminal: define a proto, generate types, implement a handler, start an HTTP/2 server, then send Alice with Connect and grpcurl. Both return {"message":"Hello, Alice!"}. Commands and code can be selected. Follow the tutorial for setup.';
    body.setAttribute('aria-describedby', help.id);
    panel.classList.add('motion-prototype', 'motion-native');
    panel.style.height = `${Math.max(366, originalHeight)}px`;
    panel.dataset.motionRevision = data.revision;
    panel.setAttribute('aria-label', 'Proto-to-service text animation prototype');
    panel.replaceChildren(surface, controls, help);

    const button = (group, label, action) => {
        const element = document.createElement('button');
        element.type = 'button';
        element.textContent = label;
        element.addEventListener('click', action);
        group.append(element);
        return element;
    };
    const svgIcon = (element, kind) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', { play: 'M8 5v14l11-7z', pause: 'M6 5h4v14H6zm8 0h4v14h-4z', replay: 'M3 11a9 9 0 1 0 3-6.7M3 3v6h6' }[kind]);
        if (kind === 'replay') {
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', 'currentColor');
            path.setAttribute('stroke-width', '1.8');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
        } else path.setAttribute('fill', 'currentColor');
        svg.append(path);
        element.replaceChildren(svg);
    };

    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = reduce.matches ? data.durationInFrames - 1 : 0;
    let playing = false;
    let interacted = false;
    let started = false;
    let animationFrame = 0;
    let origin = 0;
    let active = -1;
    let updateScene;
    let inView = false;
    const stepButtons = data.scenes.map((scene) =>
        button(steps, scene.stepLabel, () => {
            interacted = true;
            pause();
            frame = scene.start + scene.duration - 1;
            render();
        }),
    );
    const playButton = button(playback, 'Play animation', () => {
        interacted = true;
        if (playing) pause();
        else playFrom(frame);
    });
    const replayButton = button(playback, 'Replay animation', () => {
        interacted = true;
        playFrom(0);
    });
    replayButton.setAttribute('aria-label', 'Replay animation');
    replayButton.title = 'Replay animation';
    svgIcon(replayButton, 'replay');

    function revealActiveStep() {
        const button = stepButtons[active];
        if (!button) return;
        const container = steps.getBoundingClientRect();
        const bounds = button.getBoundingClientRect();
        if (bounds.left < container.left) steps.scrollLeft += bounds.left - container.left;
        else if (bounds.right > container.right) steps.scrollLeft += bounds.right - container.right;
    }
    const resize = new ResizeObserver(revealActiveStep);
    resize.observe(steps);

    function updatePlayback() {
        const label = playing ? 'Pause animation' : 'Play animation';
        playButton.setAttribute('aria-label', label);
        playButton.title = label;
        svgIcon(playButton, playing ? 'pause' : 'play');
        panel.dataset.playing = String(playing);
    }

    function codeBlock(tokens, numbers = false) {
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        pre.className = 'motion-code';
        pre.append(code);
        const rows = [];
        const characters = [];
        for (let row = 0; row < tokens.light.length; row++) {
            const line = document.createElement('span');
            line.className = 'motion-code-line';
            if (numbers) {
                const number = document.createElement('span');
                number.className = 'motion-line-number';
                number.setAttribute('aria-hidden', 'true');
                number.textContent = String(row + 1);
                line.append(number);
            }
            const flatten = (tokens) => tokens.flatMap((token) => [...token.content].map((character) => ({ character, color: token.color })));
            const light = flatten(tokens.light[row]);
            const dark = flatten(tokens.dark[row]);
            for (let index = 0; index < light.length; index++) {
                const span = document.createElement('span');
                span.className = 'motion-token';
                span.textContent = light[index].character;
                span.style.setProperty('--motion-light', light[index].color);
                span.style.setProperty('--motion-dark', dark[index].color);
                line.append(span);
                characters.push(span);
            }
            rows.push(line);
            code.append(line);
        }
        return { pre, rows, characters };
    }

    function typer(code, start, duration) {
        let previous = -1;
        return (localFrame) => {
            const typed = commandTyped(localFrame, start, duration, code.characters.length);
            if (typed === previous) return;
            previous = typed;
            code.pre.dataset.typed = String(typed);
            code.pre.dataset.characters = String(code.characters.length);
            code.characters.forEach((span, index) => {
                span.style.opacity = index <= typed ? '1' : '0';
                span.classList.toggle('motion-cursor', index === typed && typed < code.characters.length);
                span.setAttribute('aria-hidden', String(index > typed));
            });
        };
    }

    function buildScene(scene, index) {
        body.replaceChildren();
        body.scrollLeft = 0;
        body.classList.toggle('motion-console-body', index === 1 || index === 4);
        if (index === 1) {
            const code = codeBlock(scene.tokens);
            const type = typer(code, scene.typing.start, scene.typing.frames);
            const output = document.createElement('div');
            output.className = 'motion-generated';
            const path = document.createElement('strong');
            path.textContent = 'gen/greeter_pb.ts';
            const types = document.createElement('div');
            types.textContent = 'SayHelloRequest · SayHelloResponse';
            const service = document.createElement('div');
            service.textContent = 'GreeterService';
            const note = document.createElement('p');
            note.textContent = 'Generated types and descriptor · buf.gen.yaml configured';
            output.append(path, types, service, note);
            body.append(code.pre, output);
            return (localFrame) => {
                type(localFrame);
                output.hidden = localFrame < scene.typing.resultAt;
            };
        }
        if (index === 4) {
            const updates = scene.examples.map((example) => {
                const call = document.createElement('div');
                call.className = 'motion-call';
                const label = document.createElement('div');
                label.className = 'motion-call-label';
                label.textContent = example.label;
                const code = codeBlock(example.tokens);
                const type = typer(code, example.typingStart, example.typingFrames);
                const slot = document.createElement('div');
                slot.className = 'motion-result-slot';
                const result = document.createElement('div');
                result.className = 'motion-result';
                const status = document.createElement('span');
                status.className = 'motion-result-status';
                status.textContent = example.status;
                const json = document.createElement('code');
                json.textContent = JSON.stringify(example.response);
                result.append(status, json);
                slot.append(result);
                call.append(label, code.pre, slot);
                body.append(call);
                return (localFrame) => {
                    call.style.visibility = localFrame < example.visibleAt ? 'hidden' : 'visible';
                    type(localFrame);
                    result.hidden = localFrame < example.resultAt;
                };
            });
            return (localFrame) => {
                updates.forEach((update) => {
                    update(localFrame);
                });
            };
        }
        const code = codeBlock(scene.tokens, true);
        body.append(code.pre);
        return (localFrame) =>
            code.rows.forEach((line, index) => {
                const reveal = lineReveal(localFrame, index, code.rows.length);
                line.style.opacity = String(reveal.opacity);
            });
    }

    function render() {
        const scene = selectedScene(frame, data.scenes);
        const index = data.scenes.indexOf(scene);
        if (index !== active) {
            active = index;
            filename.textContent = scene.label;
            filename.title = scene.label;
            counter.textContent = `${index + 1} / ${data.scenes.length}`;
            stepButtons.forEach((button, position) => {
                button.setAttribute('aria-pressed', String(position === index));
            });
            revealActiveStep();
            updateScene = buildScene(scene, index);
        }
        updateScene(frame - scene.start);
        progress.value = frame;
        panel.dataset.frame = String(Math.floor(frame));
        panel.dataset.scene = String(index);
    }

    function tick(now) {
        if (!playing) return;
        frame = loopFrame(now - origin, data.fps, data.durationInFrames);
        render();
        if (inView && !document.hidden) animationFrame = requestAnimationFrame(tick);
    }

    function playFrom(target) {
        cancelAnimationFrame(animationFrame);
        frame = target;
        origin = performance.now() - (frame * 1000) / data.fps;
        playing = true;
        updatePlayback();
        render();
        if (inView && !document.hidden) animationFrame = requestAnimationFrame(tick);
    }

    function pause() {
        playing = false;
        cancelAnimationFrame(animationFrame);
        updatePlayback();
    }

    function resumeIfVisible() {
        cancelAnimationFrame(animationFrame);
        if (!playing || !inView || document.hidden) return;
        origin = performance.now() - (frame * 1000) / data.fps;
        animationFrame = requestAnimationFrame(tick);
    }
    const intersection = new IntersectionObserver(
        (entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
            if (inView && !started && !interacted && !reduce.matches) {
                started = true;
                playFrom(0);
            } else resumeIfVisible();
        },
        { threshold: 0.5 },
    );
    intersection.observe(panel);
    const onReducedMotion = () => {
        if (reduce.matches) {
            pause();
            const scene = selectedScene(frame, data.scenes);
            frame = scene.start + scene.duration - 1;
            render();
        }
    };
    reduce.addEventListener('change', onReducedMotion);
    document.addEventListener('visibilitychange', resumeIfVisible);
    function dispose() {
        pause();
        intersection.disconnect();
        resize.disconnect();
        reduce.removeEventListener('change', onReducedMotion);
        document.removeEventListener('visibilitychange', resumeIfVisible);
        window.removeEventListener('pagehide', dispose);
    }
    window.addEventListener('pagehide', dispose, { once: true });
    render();
    updatePlayback();
    return dispose;
}
