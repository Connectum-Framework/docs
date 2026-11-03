import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { codeToTokens } from 'shiki';
import { readableLightToken } from '../.vitepress/homepage/colors.mjs';

const root = new URL('../.vitepress/homepage/', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const evidence = JSON.parse(read('evidence.json'));
assert.equal(evidence.status, 200);
assert.deepEqual(evidence.response, { message: 'Hello, Alice!' });
for (const protocol of ['connect', 'grpc']) assert.deepEqual(evidence.calls[protocol].response, evidence.response);
const tokensFor = async (source, lang) => {
    const tokens = {};
    for (const theme of ['light', 'dark']) {
        const result = await codeToTokens(source, { lang, theme: `github-${theme}` });
        tokens[theme] = result.tokens.map((line) => line.map(({ content, color }) => ({ content, color: theme === 'light' ? readableLightToken(color) : color })));
    }
    return tokens;
};
const sources = [
    ['proto/greeter.proto', 'proto', read('example/proto/greeter.proto'), 0, 180],
    ['console', 'bash', '$ buf generate proto', 180, 105],
    ['src/greeter.ts', 'typescript', read('example/src/greeter.ts'), 285, 180],
    ['src/server.ts', 'typescript', read('example/src/server.ts'), 465, 150],
    ['console', 'bash', `${evidence.calls.connect.command}\n\n${evidence.calls.grpc.command}`, 615, 300],
];
const scenes = [];
for (const [label, lang, source, start, duration] of sources) {
    const code = source.trimEnd();
    const scene = { label, lang, code, start, duration, tokens: await tokensFor(code, lang) };
    if (start === 615) {
        scene.examples = [];
        for (const [protocol, label] of [
            ['connect', 'Connect · curl (HTTP/2)'],
            ['grpc', 'gRPC · grpcurl'],
        ]) {
            const call = evidence.calls[protocol];
            scene.examples.push({
                label,
                code: call.command,
                response: call.response,
                status: protocol === 'connect' ? `HTTP ${call.status}` : 'gRPC OK',
                tokens: await tokensFor(call.command, 'bash'),
            });
        }
    }
    scenes.push(scene);
}
const data = { scenes, evidence, fps: 30 };
const names = ['Proto', 'Generate', 'Handler', 'Server', 'Request + result'];
scenes.forEach((scene, index) => {
    scene.stepLabel = `${index + 1} ${names[index]}`;
});
scenes[1].typing = { start: 8, frames: 40, resultAt: 54 };
let cursor = 0;
for (const [index, example] of scenes[4].examples.entries()) {
    const characters = [...example.code.replaceAll('\n', '')].length;
    example.visibleAt = cursor;
    example.typingStart = cursor + 8;
    example.typingFrames = Math.ceil(characters * 1.2);
    example.resultAt = example.typingStart + example.typingFrames + 6;
    cursor = example.resultAt + (index === scenes[4].examples.length - 1 ? 45 : 30);
}
scenes[4].duration = cursor;
data.durationInFrames = scenes.at(-1).start + scenes.at(-1).duration;
data.revision = createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 16);
writeFileSync(new URL('native.json', root), `${JSON.stringify(data, null, 2)}\n`);
const hash = (source) => createHash('sha256').update(source).digest('hex');
const inputs = [
    'example/proto/greeter.proto',
    'example/src/greeter.ts',
    'example/src/server.ts',
    'example/requests/connect.sh',
    'example/requests/grpc.sh',
    'evidence.json',
    'colors.mjs',
];
const provenance = {
    revision: data.revision,
    shikiVersion: JSON.parse(readFileSync(new URL('../package.json', import.meta.resolve('shiki')), 'utf8')).version,
    inputs: Object.fromEntries(inputs.map((path) => [path, hash(read(path))])),
    generatorSha256: hash(readFileSync(new URL(import.meta.url))),
    artifactSha256: hash(read('native.json')),
    execution: 'Illustration of captured Connect/gRPC results; no service runs in the browser.',
};
writeFileSync(new URL('provenance.json', root), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(`Generated homepage walkthrough ${data.revision}.`);
