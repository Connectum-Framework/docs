/**
 * markdown-it plugin for the package-manager tabs (npm | pnpm | bun).
 *
 * Use it for commands that differ only in which tool installs dependencies or runs a
 * script. Content that differs because of what *executes* the code belongs in
 * `::: runtime` -- the two axes are independent.
 *
 *   ::: pm
 *   == npm
 *   ```bash
 *   npm install -D @connectum/cli
 *   ```
 *   == pnpm
 *   ```bash
 *   pnpm add -D @connectum/cli
 *   ```
 *   == bun
 *   ```bash
 *   bun add -d @connectum/cli
 *   ```
 *   :::
 *
 * Every tab is mandatory, and two build-time checks keep the variants honest, because
 * "all tabs present" is not the same as "all tabs correct":
 *
 *   1. Each snippet must start with its own tool, so a snippet copied from a
 *      neighbouring tab and left unedited fails the build.
 *   2. The variants must operate on the same arguments, so adding a package to one tab
 *      and forgetting the others fails the build.
 */

import {
    PACKAGE_MANAGER_LABELS,
    PACKAGE_MANAGER_PREFIXES,
    PACKAGE_MANAGERS,
    type PackageManager,
} from '../theme/packageManager.ts';
import { createVariantContainer, type Section } from './variantContainer.ts';

/**
 * Subcommands dropped when comparing arguments across tabs: they are the part that
 * legitimately differs (`npm install` / `pnpm add` / `bun add`).
 */
const SUBCOMMANDS = new Set([
    'install',
    'i',
    'add',
    'remove',
    'rm',
    'uninstall',
    'un',
    'run',
    'exec',
    'dlx',
    'x',
    'create',
    'init',
    'update',
    'up',
]);

/** Extracts the shell commands from a section's fenced code blocks, joining continuations. */
function commandsOf(lines: readonly string[]): string[] {
    const commands: string[] = [];
    let fence: string | null = null;
    let pending = '';

    for (const raw of lines) {
        const text = raw.trim();

        if (!fence) {
            const open = /^(`{3,}|~{3,})/.exec(text);
            if (open) fence = open[1];
            continue;
        }
        if (text.startsWith(fence)) {
            fence = null;
            pending = '';
            continue;
        }
        if (!text || text.startsWith('#')) continue;

        if (text.endsWith('\\')) {
            pending += `${text.slice(0, -1).trim()} `;
            continue;
        }
        commands.push((pending + text).trim());
        pending = '';
    }

    return commands;
}

/**
 * Reduces a command to the part that must be identical across tabs: the tool name and
 * its subcommand are dropped (they are what differs), as are flags (`-D` vs `-d`).
 */
function significantArguments(command: string): string[] {
    const tokens = command.split(/\s+/).filter(Boolean);
    let index = 1; // drop the tool itself
    if (index < tokens.length && SUBCOMMANDS.has(tokens[index])) index += 1;
    return tokens.slice(index).filter((token) => !token.startsWith('-'));
}

function validate(sections: Section<PackageManager>[], fail: (message: string) => never): void {
    const commandsPerTab = new Map<PackageManager, string[]>();

    for (const section of sections) {
        const commands = commandsOf(section.lines);
        commandsPerTab.set(section.value, commands);

        const allowed = PACKAGE_MANAGER_PREFIXES[section.value];
        for (const command of commands) {
            const tool = command.split(/\s+/)[0];
            if (!allowed.includes(tool)) {
                fail(
                    `the "${section.value}" tab runs "${tool}" (in "${command}").\n` +
                        `Commands in that tab must start with ${allowed.map((p) => `"${p}"`).join(' or ')} -- ` +
                        'this usually means a snippet was copied from another tab and not adjusted.',
                );
            }
        }
    }

    // Every tab must act on the same packages, in the same order.
    const [reference, ...others] = sections;
    const referenceArgs = (commandsPerTab.get(reference.value) ?? []).map(significantArguments);

    for (const section of others) {
        const args = (commandsPerTab.get(section.value) ?? []).map(significantArguments);

        if (args.length !== referenceArgs.length) {
            fail(
                `the "${reference.value}" tab has ${referenceArgs.length} command(s) but "${section.value}" has ` +
                    `${args.length}. Every tab must carry the same commands in the same order.`,
            );
        }
        for (let i = 0; i < args.length; i++) {
            const expected = referenceArgs[i].join(' ');
            const actual = args[i].join(' ');
            if (expected !== actual) {
                fail(
                    `command ${i + 1} operates on different arguments across tabs:\n` +
                        `  ${reference.value}: ${expected || '(none)'}\n` +
                        `  ${section.value}: ${actual || '(none)'}\n` +
                        'Tool names, subcommands and flags may differ; the packages and script names may not.',
                );
            }
        }
    }
}

export const pmContainerPlugin = createVariantContainer<PackageManager>({
    name: 'pm',
    prefix: 'pm',
    values: PACKAGE_MANAGERS,
    labels: PACKAGE_MANAGER_LABELS,
    // Every package manager must be filled in: a reader who picked npm and finds an
    // empty tab has no command at all, which is worse than no switcher.
    requireAll: true,
    validate,
});
