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
 * Brand marks from Simple Icons (https://simpleicons.org, CC0-1.0), inlined as the `d`
 * of a single 24x24 path so the tabs stay self-contained -- they are static HTML, not
 * Vue, so there is no component to import an icon set into. The logos remain trademarks
 * of their owners and identify the tools only.
 */
export const PACKAGE_MANAGER_ICONS: Record<PackageManager, string> = {
    npm: 'M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019l-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z',
    pnpm: 'M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM2 2h3.5v3.5H2zm8.25 0h3.498v3.5H10.25zm8.25 0H22v3.5h-3.5zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zm2 2H22v3.5h-3.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z',
    bun: 'M12 22.596c6.628 0 12-4.338 12-9.688c0-3.318-2.057-6.248-5.219-7.986c-1.286-.715-2.297-1.357-3.139-1.89C14.058 2.025 13.08 1.404 12 1.404c-1.097 0-2.334.785-3.966 1.821a50 50 0 0 1-2.816 1.697C2.057 6.66 0 9.59 0 12.908c0 5.35 5.372 9.687 12 9.687zM10.599 4.715c.334-.759.503-1.58.498-2.409c0-.145.202-.187.23-.029c.658 2.783-.902 4.162-2.057 4.624c-.124.048-.199-.121-.103-.209a5.8 5.8 0 0 0 1.432-1.977m2.058-.102a5.8 5.8 0 0 0-.782-2.306v-.016c-.069-.123.086-.263.185-.172c1.962 2.111 1.307 4.067.556 5.051c-.082.103-.23-.003-.189-.126a5.85 5.85 0 0 0 .23-2.431m1.776-.561a5.7 5.7 0 0 0-1.612-1.806v-.014c-.112-.085-.024-.274.114-.218c2.595 1.087 2.774 3.18 2.459 4.407a.12.12 0 0 1-.049.071a.11.11 0 0 1-.153-.026a.12.12 0 0 1-.022-.083a5.9 5.9 0 0 0-.737-2.331m-5.087.561c-.617.546-1.282.76-2.063 1c-.117 0-.195-.078-.156-.181c1.752-.909 2.376-1.649 2.999-2.778c0 0 .155-.118.188.085c0 .304-.349 1.329-.968 1.874m4.945 11.237a2.96 2.96 0 0 1-.937 1.553c-.346.346-.8.565-1.286.62a2.18 2.18 0 0 1-1.327-.62a2.96 2.96 0 0 1-.925-1.553a.24.24 0 0 1 .064-.198a.23.23 0 0 1 .193-.069h3.965a.23.23 0 0 1 .19.07c.05.053.073.125.063.197m-5.458-2.176a1.86 1.86 0 0 1-2.384-.245a1.98 1.98 0 0 1-.233-2.447c.207-.319.503-.566.848-.713a1.84 1.84 0 0 1 1.092-.11c.366.075.703.261.967.531a1.98 1.98 0 0 1 .408 2.114a1.93 1.93 0 0 1-.698.869zm8.495.005a1.86 1.86 0 0 1-2.381-.253a1.96 1.96 0 0 1-.547-1.366c0-.384.11-.76.32-1.079c.207-.319.503-.567.849-.713a1.84 1.84 0 0 1 1.093-.108c.367.076.704.262.968.534a1.98 1.98 0 0 1 .4 2.117a1.93 1.93 0 0 1-.702.868',
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
