import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, copyFile, mkdir, readdir, readFile, realpath, symlink, writeFile } from 'node:fs/promises';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenance } from '../.vitepress/builder/model.ts';
import { buildQuickstartProject } from '../.vitepress/quickstart/project.ts';

if (!process.env.CONNECTUM_FRAMEWORK_ROOT) throw new Error('Set CONNECTUM_FRAMEWORK_ROOT to the built target framework checkout.');
const framework = resolve(process.env.CONNECTUM_FRAMEWORK_ROOT);
const git = (...args) => execFileSync('git', args, { cwd: framework, encoding: 'utf8' }).trim();
assert.equal(git('rev-parse', 'HEAD'), provenance.sourceCommit, 'The verification checkout must match the CLI provenance.');
git('diff', '--exit-code', 'HEAD', '--', 'packages');
const artifacts = new URL('../.vitepress/quickstart/', import.meta.url);
const root = fileURLToPath(new URL('example/', artifacts));
for (const [path, source] of Object.entries(buildQuickstartProject())) {
    assert.equal(await readFile(join(root, path), 'utf8'), source, `Regenerate the Quickstart before verification: ${path}`);
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
    throw new Error(`Install the target framework dependencies first: ${name} is missing.`);
}
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
for (const name of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) {
    const target = await dependency(name);
    const link = join(root, 'node_modules', name);
    await mkdir(dirname(link), { recursive: true });
    if (!(await exists(link))) await symlink(target, link, 'dir');
    assert.equal(await realpath(link), await realpath(target), `Remove the stale dependency link before verification: ${name}`);
    if (name.startsWith('@connectum/')) await access(join(target, 'dist/index.js'));
    const pkg = JSON.parse(await readFile(join(target, 'package.json'), 'utf8'));
    const bins = typeof pkg.bin === 'string' ? { [name.split('/').at(-1)]: pkg.bin } : (pkg.bin ?? {});
    for (const [binary, path] of Object.entries(bins)) {
        const bin = join(root, 'node_modules/.bin', binary);
        await mkdir(dirname(bin), { recursive: true });
        if (!(await exists(bin))) await symlink(join(target, path), bin);
        assert.equal(await realpath(bin), await realpath(join(target, path)), `Stale tool link: ${binary}`);
    }
}
for (const [pkg, path] of [
    ['healthcheck', 'grpc/health/v1/health.proto'],
    ['reflection', 'grpc/reflection/v1/reflection.proto'],
]) {
    const target = join(root, 'proto', path);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(join(framework, 'packages', pkg, 'proto', path), target);
}
const env = { ...process.env, PATH: `${root}/node_modules/.bin${delimiter}${process.env.PATH}` };
for (const [binary, args] of [
    ['buf', ['generate']],
    ['tsc', ['--noEmit']],
    [process.execPath, ['tests/quickstart/capture.ts']],
]) {
    const command = binary.startsWith('/') ? binary : join(root, 'node_modules/.bin', binary);
    const output = execFileSync(command, args, { cwd: root, env, encoding: 'utf8', timeout: 45_000 });
    console.log(output);
}
const generated = new URL('../.vitepress/quickstart/generated/', import.meta.url);
await mkdir(generated, { recursive: true });
await copyFile(join(root, 'gen/page/v1/page_pb.ts'), new URL('page_pb.ts', generated));
const hashes = {};
for (const path of ['project-provenance.json', 'recording.json', 'generated/page_pb.ts']) {
    hashes[path] = createHash('sha256')
        .update(await readFile(new URL(path, artifacts)))
        .digest('hex');
}
await writeFile(new URL('runtime-provenance.json', artifacts), `${JSON.stringify({ frameworkCommit: provenance.sourceCommit, artifacts: hashes }, null, 2)}\n`);
