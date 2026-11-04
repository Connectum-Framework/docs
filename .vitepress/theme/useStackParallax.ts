import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { stackParallaxOffset, stackParallaxParts } from './stackParallax.ts';

export function useStackParallax(root: Ref<HTMLElement | undefined>) {
    const disabledReason = ref<'reduced' | 'link' | null>(null);
    let refresh: (() => void) | undefined;
    let stop: (() => void) | undefined;

    onMounted(() => {
        const node = root.value;
        if (!node) return;
        const parts = stackParallaxParts.flatMap((part) => {
            const block = node.querySelector<HTMLElement>(`.stack-layer--${part.key} .stack-block`);
            const svg = block?.querySelector('svg');
            return block && svg ? [{ ...part, block, svg }] : [];
        });
        if (parts.length !== stackParallaxParts.length) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const mobile = window.matchMedia('(max-width: 640px)');
        const print = window.matchMedia('print');
        const bounds = node.getBoundingClientRect();
        let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
        let enabled = false;
        let frame: number | undefined;

        function cancelFrame() {
            if (frame !== undefined) window.cancelAnimationFrame(frame);
            frame = undefined;
        }

        function reset() {
            cancelFrame();
            node?.removeAttribute('data-parallax');
            for (const { svg } of parts) svg.style.removeProperty('--stack-parallax-y');
        }

        function draw() {
            frame = undefined;
            if (!enabled || !visible || document.hidden) return;
            for (const part of parts) {
                const bounds = part.block.getBoundingClientRect();
                const offset = stackParallaxOffset({
                    top: bounds.top,
                    height: bounds.height,
                    travel: mobile.matches ? part.mobile : part.desktop,
                });
                part.svg.style.setProperty('--stack-parallax-y', `${offset}px`);
            }
        }

        // scroll events share one pending frame; there is no idle animation loop or easing clock.
        function schedule() {
            if (enabled && visible && !document.hidden && frame === undefined) frame = window.requestAnimationFrame(draw);
        }

        function sync() {
            disabledReason.value = reduced.matches ? 'reduced' : new URLSearchParams(window.location.search).get('motion') === 'static' ? 'link' : null;
            enabled = disabledReason.value === null && !print.matches;
            if (!enabled) {
                reset();
                return;
            }
            node?.setAttribute('data-parallax', '');
            if (document.hidden) cancelFrame();
            else schedule();
        }

        const intersection = new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false;
            if (visible) schedule();
            else cancelFrame();
        });
        intersection.observe(node);
        const resize = new ResizeObserver(schedule);
        resize.observe(node);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', sync);
        document.addEventListener('visibilitychange', sync);
        for (const media of [reduced, mobile, print]) media.addEventListener('change', sync);
        refresh = sync;
        stop = () => {
            enabled = false;
            reset();
            intersection.disconnect();
            resize.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', sync);
            document.removeEventListener('visibilitychange', sync);
            for (const media of [reduced, mobile, print]) media.removeEventListener('change', sync);
            refresh = undefined;
        };
        sync();
    });

    onBeforeUnmount(() => stop?.());
    return { disabledReason, refresh: () => refresh?.() };
}
