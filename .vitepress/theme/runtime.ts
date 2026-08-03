/**
 * Shared state for the site-wide runtime switcher (Node.js | Bun).
 *
 * The selected runtime lives in a single place -- the `data-runtime` attribute on
 * `<html>` -- and everything visual is derived from it with CSS. Nothing about the
 * rendered content depends on Vue state, so server-rendered HTML and client HTML are
 * byte-identical and hydration can never mismatch.
 *
 * The attribute is set before first paint by the inline `<head>` script defined in
 * `.vitepress/config/shared.ts` (the same technique VitePress uses to restore the
 * dark-mode class), so a reader who picked Bun never sees a flash of Node content.
 */

export const RUNTIMES = ['node', 'bun'] as const;

export type Runtime = (typeof RUNTIMES)[number];

/** Shown when nothing is stored yet, and to crawlers and readers without JavaScript. */
export const DEFAULT_RUNTIME: Runtime = 'node';

/** localStorage key. Kept in sync with the inline head script in `config/shared.ts`. */
export const RUNTIME_STORAGE_KEY = 'connectum-runtime';

export const RUNTIME_LABELS: Record<Runtime, string> = {
    node: 'Node.js',
    bun: 'Bun',
};

/**
 * Brand marks from Simple Icons (https://simpleicons.org, CC0-1.0), inlined as the `d`
 * of a single 24x24 path so the tabs stay self-contained -- they are static HTML, not
 * Vue, so there is no component to import an icon set into. The logos remain trademarks
 * of their owners and identify the runtimes only.
 */
export const RUNTIME_ICONS: Record<Runtime, string> = {
    node: 'M11.998 24c-.321 0-.641-.084-.922-.247L8.14 22.016c-.438-.245-.224-.332-.08-.383c.585-.203.703-.25 1.328-.604c.065-.037.151-.023.218.017l2.256 1.339a.29.29 0 0 0 .272 0l8.795-5.076a.28.28 0 0 0 .134-.238V6.921a.28.28 0 0 0-.137-.242l-8.791-5.072a.28.28 0 0 0-.271 0L3.075 6.68a.28.28 0 0 0-.139.241v10.15a.27.27 0 0 0 .139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745c-.508 0-.909 0-2.026-.551L2.28 18.675a1.86 1.86 0 0 1-.922-1.604V6.921c0-.659.353-1.275.922-1.603L11.075.236a1.93 1.93 0 0 1 1.848 0l8.794 5.082c.57.329.924.944.924 1.603v10.15a1.86 1.86 0 0 1-.924 1.604l-8.794 5.078c-.28.163-.599.247-.925.247m7.101-10.007c0-1.9-1.284-2.406-3.987-2.763c-2.731-.361-3.009-.548-3.009-1.187c0-.528.235-1.233 2.258-1.233c1.807 0 2.473.389 2.747 1.607a.254.254 0 0 0 .247.199h1.141a.26.26 0 0 0 .186-.081a.26.26 0 0 0 .067-.196c-.177-2.098-1.571-3.076-4.388-3.076c-2.508 0-4.004 1.058-4.004 2.833c0 1.925 1.488 2.457 3.895 2.695c2.88.282 3.103.703 3.103 1.269c0 .983-.789 1.402-2.642 1.402c-2.327 0-2.839-.584-3.011-1.742a.255.255 0 0 0-.253-.215h-1.137a.25.25 0 0 0-.254.253c0 1.482.806 3.248 4.655 3.248c2.788.001 4.386-1.096 4.386-3.013',
    bun: 'M12 22.596c6.628 0 12-4.338 12-9.688c0-3.318-2.057-6.248-5.219-7.986c-1.286-.715-2.297-1.357-3.139-1.89C14.058 2.025 13.08 1.404 12 1.404c-1.097 0-2.334.785-3.966 1.821a50 50 0 0 1-2.816 1.697C2.057 6.66 0 9.59 0 12.908c0 5.35 5.372 9.687 12 9.687zM10.599 4.715c.334-.759.503-1.58.498-2.409c0-.145.202-.187.23-.029c.658 2.783-.902 4.162-2.057 4.624c-.124.048-.199-.121-.103-.209a5.8 5.8 0 0 0 1.432-1.977m2.058-.102a5.8 5.8 0 0 0-.782-2.306v-.016c-.069-.123.086-.263.185-.172c1.962 2.111 1.307 4.067.556 5.051c-.082.103-.23-.003-.189-.126a5.85 5.85 0 0 0 .23-2.431m1.776-.561a5.7 5.7 0 0 0-1.612-1.806v-.014c-.112-.085-.024-.274.114-.218c2.595 1.087 2.774 3.18 2.459 4.407a.12.12 0 0 1-.049.071a.11.11 0 0 1-.153-.026a.12.12 0 0 1-.022-.083a5.9 5.9 0 0 0-.737-2.331m-5.087.561c-.617.546-1.282.76-2.063 1c-.117 0-.195-.078-.156-.181c1.752-.909 2.376-1.649 2.999-2.778c0 0 .155-.118.188.085c0 .304-.349 1.329-.968 1.874m4.945 11.237a2.96 2.96 0 0 1-.937 1.553c-.346.346-.8.565-1.286.62a2.18 2.18 0 0 1-1.327-.62a2.96 2.96 0 0 1-.925-1.553a.24.24 0 0 1 .064-.198a.23.23 0 0 1 .193-.069h3.965a.23.23 0 0 1 .19.07c.05.053.073.125.063.197m-5.458-2.176a1.86 1.86 0 0 1-2.384-.245a1.98 1.98 0 0 1-.233-2.447c.207-.319.503-.566.848-.713a1.84 1.84 0 0 1 1.092-.11c.366.075.703.261.967.531a1.98 1.98 0 0 1 .408 2.114a1.93 1.93 0 0 1-.698.869zm8.495.005a1.86 1.86 0 0 1-2.381-.253a1.96 1.96 0 0 1-.547-1.366c0-.384.11-.76.32-1.079c.207-.319.503-.567.849-.713a1.84 1.84 0 0 1 1.093-.108c.367.076.704.262.968.534a1.98 1.98 0 0 1 .4 2.117a1.93 1.93 0 0 1-.702.868',
};

export function isRuntime(value: unknown): value is Runtime {
    return value === 'node' || value === 'bun';
}

/**
 * Persist and apply a runtime. Every control and every content block reads the
 * attribute through CSS, so nothing else has to be notified.
 */
export function setRuntime(runtime: Runtime): void {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.runtime = runtime;
    try {
        localStorage.setItem(RUNTIME_STORAGE_KEY, runtime);
    } catch {
        // Private mode / storage disabled -- the choice still applies to this page view.
    }
}
