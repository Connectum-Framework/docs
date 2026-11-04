import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { stackParallaxOffset, stackParallaxParts } from '../../.vitepress/theme/stackParallax.ts';
import { partGeometry, plateModel, plateStyles, renderPlateFaces } from '../../scripts/isometric-plates.mjs';
import { model, renderHtml } from '../../scripts/technology-stack.mjs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const source = read('.vitepress/theme/assets/diagrams/technology-stack.html');

test('the three technology blocks have semantic HTML explanations and decorative vector faces', () => {
    assert.deepEqual(
        [...source.matchAll(/<h3 id="[^"]+">([^<]+)<\/h3>/g)].map((match) => match[1]),
        ['Connectum', 'ConnectRPC', 'Protobuf'],
    );
    assert.equal((source.match(/<section class="stack-layer /g) ?? []).length, 3);
    assert.equal((source.match(/<path class="sc-(?:left|right|top)"/g) ?? []).length, 9);
    for (const role of ['base', 'rim', 'outline']) assert.equal((source.match(new RegExp(`class="sc-${role}"`, 'g')) ?? []).length, 3);
    assert.equal((source.match(/<svg[^>]+aria-hidden="true"[^>]+focusable="false"/g) ?? []).length, 3);
    assert.equal((source.match(/viewBox="0 0 416 204"/g) ?? []).length, 3);
    for (const id of [...source.matchAll(/aria-labelledby="([^"]+)"/g)].map((match) => match[1])) assert.ok(source.includes(`id="${id}"`));
    assert.match(source, /Your handlers contain the business logic/);
    assert.match(source, /Native gRPC and bidirectional streams require HTTP\/2/);
    assert.match(source, /HTTP\/1\.1 and HTTP\/2 transports/);
    assert.match(source, /defineService\(\)/);
    assert.match(source, /createServer\(\)/);
    assert.match(source, /protobuf-es.*generates TypeScript descriptors/);
});

test('the standalone and embedded figure share one static source and use the host design tokens', () => {
    const component = read('.vitepress/theme/components/TechnologyStack.vue');
    assert.match(component, /technology-stack\.html\?raw/);
    assert.match(component, /v-html="figure"/);
    assert.doesNotMatch(component, /ClientOnly|fetch\(/);
    assert.ok(source.includes(plateStyles));
    assert.match(source, /--vp-font-family-base/);
    assert.match(source, /@media \(max-width: 640px\)/);
    assert.doesNotMatch(source, /<script|<iframe|https?:\/\/|box-shadow|filter:/);
    const about = read('en/guide/about.md');
    assert.match(about, /## Mental Model\n\n<TechnologyStack \/>/);
    for (const anchor of ['what-is-connectum', 'choose-your-path', 'architecture-overview', 'modules']) assert.ok(about.includes(`{#${anchor}}`));
});

test('scroll decoration enhances only About SVGs after mount and leaves the source figure static', () => {
    const component = read('.vitepress/theme/components/TechnologyStack.vue');
    const hook = read('.vitepress/theme/useStackParallax.ts');
    assert.match(component, /useStackParallax\(root\)/);
    assert.match(component, /onContentUpdated\(refresh\)/);
    assert.match(hook, /get\('motion'\) === 'static'/);
    assert.match(hook, /onMounted\(/);
    assert.match(hook, /addEventListener\('scroll', schedule, \{ passive: true \}\)/);
    assert.match(hook, /frame === undefined/);
    assert.match(hook, /onBeforeUnmount\(/);
    assert.match(hook, /removeEventListener\('scroll', schedule\)/);
    assert.match(hook, /cancelAnimationFrame\(frame\)/);
    assert.match(hook, /intersection\.disconnect\(\)/);
    assert.match(hook, /resize\.disconnect\(\)/);
    assert.match(hook, /document\.hidden/);
    assert.match(hook, /part\.block\.getBoundingClientRect\(\)/);
    assert.match(component, /@media screen and \(prefers-reduced-motion: no-preference\)/);
    assert.match(component, /translateY\(var\(--stack-parallax-y, 0px\)\)/);
    assert.match(component, /html\[data-motion='static'\][\s\S]*transform: none;/);
    assert.match(component, /Motion is off because your system requests reduced motion/);
    assert.match(component, /Motion is disabled by the \?motion=static setting/);
    assert.doesNotMatch(component + hook, /animation-timeline|view-timeline|CSS\.supports|setInterval|setTimeout|rotate\(|scale\(|perspective/);
    assert.doesNotMatch(source, /@keyframes|animation-timeline|data-parallax/);
    assert.deepEqual(
        stackParallaxParts.map((part) => part.desktop),
        [24, 18, 12],
    );
    assert.deepEqual(
        stackParallaxParts.map((part) => part.mobile),
        [14, 10, 6],
    );
});

test('scroll offsets spend their travel over one visible plate height, without document or viewport length', () => {
    for (const travel of [24, 18, 12, 14, 10, 6]) {
        for (const height of [128, 160, 176]) {
            assert.equal(stackParallaxOffset({ top: 1000, height, travel }), 0);
            assert.equal(stackParallaxOffset({ top: 96 + height, height, travel }), 0);
            assert.equal(stackParallaxOffset({ top: 96 + height / 2, height, travel }), -travel / 2);
            assert.equal(stackParallaxOffset({ top: 96, height, travel }), -travel);
            assert.equal(stackParallaxOffset({ top: -1000, height, travel }), -travel);
            const first = stackParallaxOffset({ top: 96 + height * 0.85, height, travel });
            assert.ok(
                stackParallaxOffset({ top: 96 + height * 0.85 - 80, height, travel }) < first - travel * 0.4,
                'An 80px gesture must use the travel while the plate remains visible.',
            );
            assert.equal(stackParallaxOffset({ top: 96 + height * 0.85, height, travel }), first);
        }
        assert.equal(stackParallaxOffset({ top: 100, height: 0, travel }), 0);
    }
});

test('About reuses the Server plate geometry, face painter and complete light/dark skin', () => {
    assert.equal(source, renderHtml());
    assert.deepEqual(plateModel, { size: 184, radius: 12, thickness: 20, gap: 60 });
    const faces = renderPlateFaces(partGeometry(0, model.origin));
    assert.equal(source.split(faces).length - 1, 3);
    assert.deepEqual(
        model.parts.filter((part) => part.focal).map((part) => part.key),
        ['connectum'],
    );
    assert.equal((source.match(/ data-focal>/g) ?? []).length, 1);
    assert.doesNotMatch(source, /stack-strength|stack-block-name|transform:|linearGradient|opacity:\s*0\./);
    assert.match(source, /\.stack-layers\s*\{[^}]*gap: 4px/);
    assert.match(source, /@media \(max-width: 640px\)[\s\S]*?\.stack-layers\s*\{[^}]*gap: 16px/);
    assert.match(read('scripts/server-composition.mjs'), /from '\.\/isometric-plates\.mjs'/);
    assert.match(read('scripts/technology-stack.mjs'), /from '\.\/isometric-plates\.mjs'/);
});

test('project instructions direct future isometric figures to the shared renderer and visual reference', () => {
    const instructions = read('AGENTS.md');
    assert.match(instructions, /documentation-style\.md#isometric-composition-style/);
    assert.match(instructions, /en\/guide\/server\.md/);
    const guide = read('en/contributing/documentation-style.md');
    for (const contract of ['scripts/isometric-plates.mjs', '184 × 184', 'radius 12', 'thickness 20', '1.2 units', '0.8 units', 'data-focal', 'node scripts/technology-stack.mjs'])
        assert.ok(guide.includes(contract), contract);
});
