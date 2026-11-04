import type { Ref } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { lineReveal } from '../homepage/motion.mjs';
import { commandTyped } from '../homepage/player.mjs';

type AnimatedLine = { element: HTMLElement; html: string; style: string | null; terminal: boolean };
type AnimatedPart = { element: HTMLElement; lines: AnimatedLine[]; characters: HTMLElement[]; typed: number };

export function useCodeAnimation(root: Ref<HTMLElement | undefined>) {
    const frame = ref(1);
    const playing = ref(false);
    const reduced = ref(false);
    const inView = ref(false);
    const visible = ref(true);
    const part = ref(-1);
    const run = ref(0);
    const phase = computed(() => (playing.value ? (inView.value && visible.value ? 'playing' : 'waiting') : frame.value === 1 ? 'complete' : 'paused'));
    let mounted = false;
    let scheduled = 0;
    let previousTime = 0;
    let parts: AnimatedPart[] = [];
    let observer: IntersectionObserver | undefined;
    let media: MediaQueryList | undefined;
    let scrollFrame = 0;
    const partDuration = 2000;

    function cancel() {
        cancelAnimationFrame(scheduled);
        cancelAnimationFrame(scrollFrame);
        scheduled = 0;
        scrollFrame = 0;
        previousTime = 0;
    }

    function restore() {
        for (const line of parts.flatMap((part) => part.lines)) {
            line.element.innerHTML = line.html;
            if (line.style === null) line.element.removeAttribute('style');
            else line.element.setAttribute('style', line.style);
        }
        parts = [];
    }

    function reveal(item: AnimatedPart, show: boolean) {
        if (item.element instanceof HTMLDetailsElement) item.element.open = show;
        else item.element.hidden = !show;
    }

    function finish() {
        cancel();
        playing.value = false;
        frame.value = 1;
        part.value = -1;
        for (const item of parts) reveal(item, true);
        restore();
    }

    function prepare(item: AnimatedPart) {
        for (const pane of item.element.querySelectorAll<HTMLElement>('div[class*="language-"]')) pane.scrollTop = 0;
        const elements = item.element.querySelectorAll<HTMLElement>('pre code > .line');
        for (const element of elements) {
            const terminal = element.closest('.language-bash') !== null;
            item.lines.push({ element, html: element.innerHTML, style: element.getAttribute('style'), terminal });
            if (!terminal) continue;
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            const nodes: Text[] = [];
            for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node instanceof Text) nodes.push(node);
            for (const node of nodes) {
                const fragment = document.createDocumentFragment();
                for (const character of node.data) {
                    const span = document.createElement('span');
                    span.className = 'quickstart-character';
                    span.textContent = character;
                    span.style.opacity = '0';
                    item.characters.push(span);
                    fragment.append(span);
                }
                node.replaceWith(fragment);
            }
        }
    }

    function paint(item: AnimatedPart, progress: number) {
        const code = item.lines.filter((line) => !line.terminal);
        code.forEach((line, index) => {
            line.element.style.opacity = String(lineReveal(progress * 137, index, code.length).opacity);
        });
        if (progress > 0 && progress < 1 && !root.value?.querySelector(':focus-visible')) {
            const latest = code.filter((line) => Number(line.element.style.opacity) > 0.5).at(-1)?.element;
            const pane = latest?.closest<HTMLElement>('div[class*="language-"]');
            if (latest && pane) {
                const bottom = latest.getBoundingClientRect().bottom - pane.getBoundingClientRect().top + pane.scrollTop;
                if (bottom > pane.scrollTop + pane.clientHeight - 16) pane.scrollTop = bottom - pane.clientHeight + 16;
            }
        }
        const typed = commandTyped(progress, 0, 1, item.characters.length);
        for (let index = item.typed; index < typed; index++) item.characters[index].style.opacity = '1';
        item.characters[Math.max(0, item.typed - 1)]?.classList.remove('quickstart-character--cursor');
        if (progress < 1) item.characters[Math.max(0, typed - 1)]?.classList.add('quickstart-character--cursor');
        item.typed = typed;
    }

    function render() {
        const index = Math.min(parts.length - 1, Math.floor(frame.value * parts.length));
        if (index !== part.value) {
            part.value = index;
            parts.forEach((item, position) => {
                reveal(item, position <= index);
            });
            if (index > 0) {
                scrollFrame = requestAnimationFrame(() => {
                    scrollFrame = 0;
                    if (mounted && playing.value && !root.value?.querySelector(':focus-visible')) {
                        parts[index]?.element.scrollIntoView({ block: 'nearest', behavior: 'instant' });
                    }
                });
            }
        }
        parts.forEach((item, position) => {
            paint(item, Math.max(0, Math.min(1, frame.value * parts.length - position)));
        });
    }

    function schedule() {
        if (mounted && playing.value && inView.value && visible.value && !scheduled) scheduled = requestAnimationFrame(tick);
    }

    function tick(time: number) {
        scheduled = 0;
        if (!mounted || !playing.value || !inView.value || !visible.value) return;
        if (previousTime) frame.value = Math.min(1, frame.value + Math.min(time - previousTime, 80) / (partDuration * parts.length));
        previousTime = time;
        render();
        if (frame.value === 1) finish();
        else schedule();
    }

    function replay() {
        finish();
        if (!mounted) return;
        const stage = [...(root.value?.querySelectorAll<HTMLElement>('.quickstart-stage') ?? [])].find((element) => element.checkVisibility());
        parts = [...(stage?.querySelectorAll<HTMLElement>('[data-animation-part]') ?? [])].map((element) => ({ element, lines: [], characters: [], typed: 0 }));
        parts.sort((left, right) => Number(left.element.dataset.animationPart) - Number(right.element.dataset.animationPart));
        if (!parts.length) return;
        if (parts.some((item, index) => Number(item.element.dataset.animationPart) !== index)) throw new Error('Animation parts must have consecutive indices starting at zero.');
        if (reduced.value) {
            finish();
            return;
        }
        parts.forEach(prepare);
        frame.value = 0;
        playing.value = true;
        run.value += 1;
        render();
        schedule();
    }

    function toggle() {
        if (playing.value) {
            cancel();
            playing.value = false;
        } else if (frame.value === 1) replay();
        else {
            playing.value = true;
            schedule();
        }
    }

    function visibility() {
        visible.value = document.visibilityState !== 'hidden';
        if (visible.value) schedule();
        else cancel();
    }

    function preference() {
        reduced.value = media?.matches ?? false;
        if (reduced.value) finish();
    }

    onMounted(() => {
        mounted = true;
        media = matchMedia('(prefers-reduced-motion: reduce)');
        preference();
        media.addEventListener('change', preference);
        document.addEventListener('visibilitychange', visibility);
        visibility();
        if (!root.value) return;
        observer = new IntersectionObserver((entries) => {
            inView.value = entries.some((entry) => entry.isIntersecting);
            if (inView.value) schedule();
            else cancel();
        });
        observer.observe(root.value);
    });

    onBeforeUnmount(() => {
        mounted = false;
        finish();
        observer?.disconnect();
        media?.removeEventListener('change', preference);
        document.removeEventListener('visibilitychange', visibility);
    });

    return { frame, playing, phase, reduced, part, run, finish, replay, toggle };
}
