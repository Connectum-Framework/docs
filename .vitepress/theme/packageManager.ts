/**
 * Shared state for the package-manager tabs (npm | pnpm | bun).
 *
 * A sibling of `runtime.ts` and deliberately independent of it: the package manager
 * and the runtime are orthogonal. `bun install` lays out an ordinary `node_modules`
 * that Node.js reads, and a project installed with npm runs under Bun unchanged --
 * the CLI scaffold matrix exercises exactly that combination.
 *
 * The selection lives in the `data-pm` attribute on `<html>`, is applied before first
 * paint by the inline `<head>` script in `.vitepress/config/shared.ts`, and drives the
 * tabs purely through CSS. No Vue state is involved, so hydration cannot mismatch.
 */

export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'bun'] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

/**
 * Shown when nothing is stored yet, and to crawlers and readers without JavaScript.
 * pnpm, because the framework and every example are built on it.
 */
export const DEFAULT_PACKAGE_MANAGER: PackageManager = 'pnpm';

/** localStorage key. Kept in sync with the inline head script in `config/shared.ts`. */
export const PACKAGE_MANAGER_STORAGE_KEY = 'connectum-pm';

export const PACKAGE_MANAGER_LABELS: Record<PackageManager, string> = {
    npm: 'npm',
    pnpm: 'pnpm',
    bun: 'bun',
};

/**
 * Command prefixes each tab's snippet is allowed to start with. Enforced at build time
 * so a snippet copied from a neighbouring tab and left unedited fails the build.
 */
export const PACKAGE_MANAGER_PREFIXES: Record<PackageManager, readonly string[]> = {
    npm: ['npm', 'npx'],
    pnpm: ['pnpm', 'pnpx'],
    bun: ['bun', 'bunx'],
};

export function isPackageManager(value: unknown): value is PackageManager {
    return (PACKAGE_MANAGERS as readonly string[]).includes(value as string);
}

/**
 * Persist and apply a package manager. Every tab reads the attribute through CSS, so
 * nothing else has to be notified.
 */
export function setPackageManager(pm: PackageManager): void {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.pm = pm;
    try {
        localStorage.setItem(PACKAGE_MANAGER_STORAGE_KEY, pm);
    } catch {
        // Private mode / storage disabled -- the choice still applies to this page view.
    }
}
