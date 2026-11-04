import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, copyFile, mkdir, readdir, readFile, realpath, symlink, writeFile } from 'node:fs/promises';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildProject, defaultSelection, provenance } from '../.vitepress/builder/model.ts';

assert.ok(process.env.CONNECTUM_FRAMEWORK_ROOT, 'Set CONNECTUM_FRAMEWORK_ROOT to the built target checkout.');
const framework = resolve(process.env.CONNECTUM_FRAMEWORK_ROOT);
const git = (...args) => execFileSync('git', args, { cwd: framework, encoding: 'utf8' }).trim();
assert.equal(git('rev-parse', 'HEAD'), provenance.sourceCommit, 'Testing examples must use the scaffold target revision.');
git('diff', '--exit-code', 'HEAD', '--', 'packages');
const root = fileURLToPath(new URL('../.tmp/testing-guides/', import.meta.url));
const files = buildProject({ ...defaultSelection(), name: 'testing-guides' });
for (const [path, source] of Object.entries(files)) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), source);
}

const packageRoots = (await readdir(join(framework, 'packages'))).map((name) => join(framework, 'packages', name));
const exists = (path) =>
    access(path).then(
        () => true,
        () => false,
    );
async function dependency(name) {
    if (name.startsWith('@connectum/')) return join(framework, 'packages', name.slice('@connectum/'.length));
    for (const base of [framework, ...packageRoots]) {
        const path = join(base, 'node_modules', name);
        if (await exists(path)) return realpath(path);
    }
    for (const entry of await readdir(join(framework, 'node_modules/.pnpm'))) {
        if (!entry.startsWith(`${name.replaceAll('/', '+')}@`)) continue;
        const path = join(framework, 'node_modules/.pnpm', entry, 'node_modules', name);
        if (await exists(path)) return realpath(path);
    }
    throw new Error(`Missing target dependency: ${name}`);
}

const manifest = JSON.parse(files['package.json']);
const names = new Set([...Object.keys({ ...manifest.dependencies, ...manifest.devDependencies }), '@connectum/testing', '@connectum/test-fixtures']);
for (const name of names) {
    const target = await dependency(name);
    const link = join(root, 'node_modules', name);
    await mkdir(dirname(link), { recursive: true });
    if (!(await exists(link))) await symlink(target, link, 'dir');
    assert.equal(await realpath(link), await realpath(target), `Refusing stale dependency link: ${name}`);
    if (name.startsWith('@connectum/')) await access(join(target, 'dist/index.js'));
    const pkg = JSON.parse(await readFile(join(target, 'package.json'), 'utf8'));
    const bins = typeof pkg.bin === 'string' ? { [name.split('/').at(-1)]: pkg.bin } : (pkg.bin ?? {});
    for (const [binary, path] of Object.entries(bins)) {
        const bin = join(root, 'node_modules/.bin', binary);
        await mkdir(dirname(bin), { recursive: true });
        if (!(await exists(bin))) await symlink(join(target, path), bin);
        assert.equal(await realpath(bin), await realpath(join(target, path)), `Refusing stale tool link: ${binary}`);
    }
}

const snippets = [];
for (const page of ['unit', 'integration']) {
    const source = await readFile(new URL(`../en/guide/testing/${page}.md`, import.meta.url), 'utf8');
    const blocks = [...source.matchAll(/```typescript\n([\s\S]*?)\n```/g)];
    assert.equal(blocks.length, page === 'unit' ? 2 : 3, `${page}: review verification when changing the runnable examples`);
    for (const [index, block] of blocks.entries()) {
        const path = `tests/guide-${page}-${index + 1}.test.ts`;
        await mkdir(dirname(join(root, path)), { recursive: true });
        await writeFile(join(root, path), `${block[1]}\n`);
        snippets.push(path);
    }
}

const env = { ...process.env, PATH: `${root}/node_modules/.bin${delimiter}${process.env.PATH}` };
const catalog = fileURLToPath(new URL('../.vitepress/catalog/example/', import.meta.url));
execFileSync('pnpm', ['generate'], { cwd: catalog, encoding: 'utf8', timeout: 60_000 });
console.log(execFileSync(join(root, 'node_modules/.bin/buf'), ['generate'], { cwd: root, env, encoding: 'utf8', timeout: 60_000 }));
for (const path of ['catalog.gen.ts', 'shop/v1/catalog_pb.ts']) {
    await mkdir(dirname(join(root, 'gen', path)), { recursive: true });
    await copyFile(join(catalog, 'gen', path), join(root, 'gen', path));
}
for (const [command, args] of [
    [join(root, 'node_modules/.bin/tsc'), ['--noEmit']],
    [process.execPath, ['--test', ...snippets]],
])
    console.log(execFileSync(command, args, { cwd: root, env, encoding: 'utf8', timeout: 60_000 }));
for (const name of names) assert.equal(await realpath(join(root, 'node_modules', name)), await realpath(await dependency(name)));
console.log(`Testing Guides: ${snippets.length} exact authored snippets generated, typechecked and executed against ${provenance.sourceCommit}.`);
