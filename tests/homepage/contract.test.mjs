import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { contrast } from '../../.vitepress/homepage/colors.mjs';
import { deploymentMarkup } from '../../.vitepress/homepage/deployment-markup.mjs';
import { staticDeploymentSvg } from '../../.vitepress/homepage/static-deployment.mjs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const data = JSON.parse(read('.vitepress/homepage/native.json'));
const hash = (source) => createHash('sha256').update(source).digest('hex');

test('the homepage transcript retains the exact contract, handler, listener and executable request commands', () => {
    for (const [index, path] of [
        [0, 'proto/greeter.proto'],
        [2, 'src/greeter.ts'],
        [3, 'src/server.ts'],
    ]) {
        assert.equal(data.scenes[index].code, read(`.vitepress/homepage/example/${path}`).trimEnd());
    }
    for (const [index, protocol] of ['connect', 'grpc'].entries()) {
        const example = data.scenes[4].examples[index];
        assert.equal(example.code, read(`.vitepress/homepage/example/requests/${protocol}.sh`).trimEnd());
        assert.deepEqual(example.response, { message: 'Hello, Alice!' });
    }
    assert.equal(data.evidence.status, 200);
    assert.deepEqual(data.evidence.response, { message: 'Hello, Alice!' });
    assert.match(data.scenes[3].code, /allowHTTP1: false/);
});

test('both native token palettes preserve the source and light tokens retain normal-text contrast', () => {
    for (const scene of data.scenes) {
        for (const example of [scene, ...(scene.examples ?? [])]) {
            for (const theme of ['light', 'dark']) {
                assert.equal(example.tokens[theme].map((line) => line.map((token) => token.content).join('')).join('\n'), example.code);
            }
            for (const token of example.tokens.light.flat()) assert.ok(contrast(token.color, '#f6f6f7') >= 4.5, token.color);
        }
    }
});

test('the committed timeline and source provenance refer to the same generated snapshot', () => {
    const { revision, ...content } = data;
    assert.equal(hash(JSON.stringify(content)).slice(0, 16), revision);
    const provenance = JSON.parse(read('.vitepress/homepage/provenance.json'));
    assert.equal(provenance.revision, revision);
    assert.equal(provenance.artifactSha256, hash(read('.vitepress/homepage/native.json')));
    assert.equal(provenance.generatorSha256, hash(read('scripts/generate-homepage-story.mjs')));
    for (const [path, expected] of Object.entries(provenance.inputs)) assert.equal(hash(read(`.vitepress/homepage/${path}`)), expected, path);
});

test('the server-rendered deployment is a real labelled monolith with the same three services', () => {
    const svg = staticDeploymentSvg();
    assert.match(svg, /role="img"/);
    assert.match(svg, /Monolith: 1 process/);
    assert.match(svg, /Profile, Users and Avatars share a process/);
    for (const service of ['profile', 'users', 'avatars']) assert.match(svg, new RegExp(`deployment-service--${service}`));
    assert.equal((svg.match(/class="deployment-boundary /g) ?? []).length, 1);
    const compact = staticDeploymentSvg(true);
    assert.match(compact, /viewBox="0 0 320 382"/);
    assert.doesNotMatch(compact, /deployment-service__icon/);
    assert.match(compact, /deployment-static-compact-title/);
    const markup = deploymentMarkup(svg);
    assert.ok(markup.includes(svg));
    assert.match(markup, /Illustrative deployment diagrams, not live redeployment/);
    assert.match(markup, /ctx\.call\(\)/);
});

test('the real homepage owns both players and keeps its original no-JS server example', () => {
    const home = read('.vitepress/theme/components/HomePage.vue');
    assert.match(home, /<HomeCodeWalkthrough>/);
    assert.match(home, /<slot name="server-example"\s*\/>/);
    assert.match(home, /<HomeDeployments\s*\/>/);
    assert.match(read('.vitepress/theme/components/HomeCodeWalkthrough.vue'), /<slot\s*\/>/);
    for (const name of ['HomeCodeWalkthrough', 'HomeDeployments']) {
        const component = read(`.vitepress/theme/components/${name}.vue`);
        assert.match(component, /onBeforeUnmount/);
        assert.match(component, /if \(!active/);
        assert.match(component, /dispose\?\.\(\)/);
    }
    assert.match(read('.vitepress/homepage/prototype.js'), /not a live terminal/);
    assert.doesNotMatch(read('.vitepress/homepage/prototype.js'), /__motion|fetch\(/);
    assert.doesNotMatch(read('.vitepress/homepage/deployment.js'), /document\.querySelector|example\.after/);
});
