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
