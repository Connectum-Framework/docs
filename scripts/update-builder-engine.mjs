import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { builtinModules, createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const framework = resolve(process.env.CONNECTUM_FRAMEWORK_ROOT ?? resolve(root, '../connectum'));
const examples = resolve(process.env.CONNECTUM_EXAMPLES_ROOT ?? resolve(root, '../examples'));
const scaffold = resolve(framework, 'packages/cli/src/scaffold');
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trimEnd();
git(framework, 'diff', '--exit-code', 'HEAD', '--', 'packages/cli/src/scaffold');
const sourceCommit = git(framework, 'rev-parse', 'HEAD');
const { DEFAULT_BASE_REF } = await import(pathToFileURL(resolve(scaffold, 'fetchBase.ts')).href);
const { EVENTS_OPTIONS_PROTO_PATH } = await import(pathToFileURL(resolve(scaffold, 'eventsFragment.ts')).href);
const paths = git(examples, 'ls-tree', '-r', '--name-only', DEFAULT_BASE_REF, 'getting-started').split('\n');
const base = {};
for (const path of paths) {
    if (!path.startsWith('getting-started/')) throw new Error(`Unexpected base path: ${path}`);
    base[path.slice('getting-started/'.length)] = execFileSync('git', ['show', `${DEFAULT_BASE_REF}:${path}`], { cwd: examples, encoding: 'utf8' });
}

const requireVitePress = createRequire(await realpath(resolve(root, 'node_modules/vitepress/package.json')));
const requireVite = createRequire(requireVitePress.resolve('vite/package.json'));
const { build } = requireVite('esbuild');
const bundled = await build({
    stdin: { contents: `export { transformBase } from ${JSON.stringify(resolve(scaffold, 'transform.ts'))};`, resolveDir: scaffold, loader: 'ts' },
    bundle: true,
    platform: 'browser',
    format: 'esm',
    target: 'es2022',
    minify: true,
    legalComments: 'none',
    write: false,
    metafile: true,
    plugins: [
        {
            name: 'fold-fixed-proto-path',
            setup(build) {
                build.onLoad({ filter: /[/\\]bufConfig\.ts$/ }, async ({ path }) => {
                    const source = await readFile(path, 'utf8');
                    const importLine = 'import { posix } from "node:path";';
                    const expression = 'posix.dirname(EVENTS_OPTIONS_PROTO_PATH)';
                    if (!source.includes(importLine) || !source.includes(expression)) throw new Error('CLI buf generator changed; review the browser adaptation before updating.');
                    // only the upstream constant is folded; every scaffold transform remains the CLI's code.
                    return { contents: source.replace(importLine, '').replace(expression, JSON.stringify(dirname(EVENTS_OPTIONS_PROTO_PATH))), loader: 'ts' };
                });
            },
        },
    ],
});
const engine = bundled.outputFiles[0].text;
if (
    Object.values(bundled.metafile.outputs)
        .flatMap((output) => output.imports)
        .some((entry) => entry.path.startsWith('node:'))
)
    throw new Error('The scaffold bundle still requires a Node.js module.');
const out = resolve(root, '.vitepress/builder/generated');
await mkdir(out, { recursive: true });
await writeFile(
    resolve(out, 'engine.mjs'),
    `// SPDX-License-Identifier: Apache-2.0\n// Generated from Connectum CLI ${sourceCommit}; update with builder:update, not by hand.\n${engine}`,
);
await writeFile(resolve(out, 'base.json'), `${JSON.stringify(base, null, 2)}\n`);
await writeFile(
    resolve(out, 'provenance.json'),
    `${JSON.stringify(
        {
            sourceCommit,
            sourceUrl: `https://github.com/Connectum-Framework/connectum/tree/${sourceCommit}/packages/cli/src/scaffold`,
            baseRef: DEFAULT_BASE_REF,
            baseCommit: git(examples, 'rev-parse', `${DEFAULT_BASE_REF}^{commit}`),
            engineHash: createHash('sha256').update(engine).digest('hex'),
            cliVersion: '1.3.0',
            releaseStatus: 'preview',
            registryVersion: '1.2.0',
            reservedProjectNames: [...new Set(['node_modules', 'favicon.ico', ...builtinModules.filter((name) => !name.startsWith('_') && !name.startsWith('node:'))])].sort(),
        },
        null,
        2,
    )}\n`,
);
console.log(`Builder engine: ${sourceCommit.slice(0, 12)}, examples@${DEFAULT_BASE_REF}, ${paths.length} base files, ${Buffer.byteLength(engine)} bytes of browser code.`);
