import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { normalizeNavigation } from '../tests/guide/navigation-preservation.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const hash = (source) => createHash('sha256').update(source).digest('hex');
const edits = JSON.parse(read('tests/guide/release-target-edits.json'));
const preserved = JSON.parse(read('tests/guide/preserved-sections.json'));
if (process.argv[2] === '--release-baseline') {
    const revision = process.argv[3];
    assert.ok(revision && /^[a-f0-9]{40}$/.test(revision), 'Supply the full reviewed release-documentation commit SHA.');
    for (const page of preserved) {
        const path = `${page.detail.slice(1)}.md`;
        const before = execFileSync('git', ['show', `${revision}:${path}`], { cwd: root, encoding: 'utf8' }).replace(`\n[Overview](${page.route})\n`, '');
        const current = read(path).replace(`\n[Overview](${page.route})\n`, '');
        const edit = edits.find((entry) => entry.detail === page.detail);
        let reviewed = before;
        for (const { before: old, after } of edit?.replacements ?? []) {
            assert.equal(reviewed.split(old).length, 2, `${page.detail}: the reviewed wording replacement must match once`);
            reviewed = reviewed.replace(old, after);
        }
        const expected = hash(normalizeNavigation(reviewed));
        assert.equal(hash(normalizeNavigation(current)), expected, `${page.detail}: changes exceed canonical links and scaffold naming`);
        page.sha256 = hash(reviewed);
        page.navigationSha256 = expected;
        page.navigationBaselineSha256 = hash(normalizeNavigation(before));
        if (edit) edit.baselineSha256 = hash(before);
    }
    writeFileSync(new URL('tests/guide/preserved-sections.json', root), `${JSON.stringify(preserved, null, 2)}\n`);
    writeFileSync(new URL('tests/guide/release-target-edits.json', root), `${JSON.stringify(edits, null, 2)}\n`);
    console.log(`Preserved ${preserved.length} complete pages against reviewed release documentation ${revision}.`);
    process.exit(0);
}
if (process.argv[2] === '--navigation-baseline') {
    assert.ok(process.argv[3], 'Supply the reviewed baseline checkout.');
    for (const page of preserved) {
        const before = readFileSync(resolve(process.argv[3], `${page.detail.slice(1)}.md`), 'utf8').replace(`\n[Overview](${page.route})\n`, '');
        assert.equal(hash(before), page.sha256, `${page.detail}: baseline differs from the preserved source`);
        const current = read(`${page.detail.slice(1)}.md`).replace(`\n[Overview](${page.route})\n`, '');
        page.navigationSha256 = hash(normalizeNavigation(before));
        assert.equal(hash(normalizeNavigation(current)), page.navigationSha256, `${page.detail}: changes exceed canonical links and scaffold naming`);
        let baseline = before;
        for (const { before: old, after } of [...(edits.find((edit) => edit.detail === page.detail)?.replacements ?? [])].reverse()) baseline = baseline.replace(after, old);
        page.navigationBaselineSha256 = hash(normalizeNavigation(baseline));
    }
    writeFileSync(new URL('tests/guide/preserved-sections.json', root), `${JSON.stringify(preserved, null, 2)}\n`);
    console.log(`Preserved ${preserved.length} complete pages across approved navigation edits.`);
    process.exit(0);
}
for (const edit of edits) {
    const page = preserved.find((page) => page.detail === edit.detail);
    assert.ok(page, edit.detail);
    const source = read(`${page.detail.slice(1)}.md`).replace(`\n[Overview](${page.route})\n`, '');
    let baseline = source;
    for (const { before, after } of [...edit.replacements].reverse()) {
        assert.equal(baseline.split(after).length, 2, `The editorial replacement must be unique: ${after}`);
        baseline = baseline.replace(after, before);
    }
    assert.equal(hash(baseline), edit.baselineSha256, `${edit.detail}: changes exceed the approved release wording`);
    page.sha256 = hash(source);
    console.log(`${page.detail}: ${page.sha256}`);
}
writeFileSync(new URL('tests/guide/preserved-sections.json', root), `${JSON.stringify(preserved, null, 2)}\n`);
