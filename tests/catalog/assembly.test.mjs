import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { assemblyContracts, assemblyLayouts } from '../../.vitepress/catalog/assembly.ts';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('all layouts assemble exactly the same two contracts with explicit generation boundaries', () => {
    assert.deepEqual(
        assemblyLayouts.map((layout) => layout.id),
        ['folder', 'packages', 'repositories'],
    );
    for (const layout of assemblyLayouts) {
        const contracts = layout.groups.flatMap((group) => group.contracts);
        assert.deepEqual([...contracts].sort(), Object.keys(assemblyContracts).sort());
        assert.equal(new Set(contracts).size, contracts.length);
        assert.equal(layout.groups.length, layout.id === 'folder' ? 1 : 2);
        for (const group of layout.groups) {
            assert.ok(layout.code.includes(`from '${group.importFrom}'`));
            assert.equal(Boolean(group.dependency), layout.id === 'repositories');
            if (group.dependency) assert.equal(group.dependency, `${group.importFrom}@1.0.0`);
        }
        assert.equal(layout.code.includes('mergeCatalogs('), layout.id !== 'folder');
        assert.doesNotMatch(layout.code, /https?:\/\//);
    }
    assert.equal(assemblyLayouts[1].code, assemblyLayouts[2].code);
    assert.match(assemblyLayouts[0].caveat, /another folder does not require merging/);
});

test('catalog entries explain the actual Orders and Inventory example contract, without handlers or addresses', () => {
    const proto = read('.vitepress/catalog/example/proto/shop/v1/catalog.proto');
    for (const contract of Object.values(assemblyContracts)) {
        assert.equal(contract.typeName, `shop.v1.${contract.descriptor}`);
        assert.ok(proto.includes(`service ${contract.descriptor} {`));
        assert.ok(proto.includes(`rpc ${contract.method}(${contract.request}) returns (${contract.response});`));
        for (const message of [contract.request, contract.response]) assert.ok(proto.includes(`message ${message} {`));
        for (const value of Object.values(contract)) assert.doesNotMatch(value, /https?:\/\/|localhost|5000/);
    }
    const component = read('.vitepress/theme/components/CatalogAssembly.vue');
    assert.match(component, /Runtime value/);
    assert.match(component, /TypeScript only/);
    assert.match(component, /merges values, not types/);
    assert.match(component, /CatalogConfigError/);
    assert.match(component, /ConnectumStreamMap/);
});

test('only the catalog overview mounts the bespoke assembly illustration', () => {
    const component = read('.vitepress/theme/components/CatalogAssembly.vue');
    assert.doesNotMatch(component, /GuideFlow|guideFrame|setInterval|requestAnimationFrame/);
    assert.match(component, /v-model="selected"/);
    assert.match(component, /assembly-transcript/);
    assert.match(component, /No generator runs in this browser/);
    assert.match(component, /observer\?\.disconnect\(\)/);
    assert.match(read('.vitepress/theme/index.ts'), /app\.component\('CatalogAssembly', CatalogAssembly\)/);
    const css = read('.vitepress/theme/styles/catalog-assembly.css');
    for (const mechanism of ['assembly-generate', 'assembly-import', 'assembly-merge', 'assembly-deliver', 'assembly-delivered-merge'])
        assert.ok(css.includes(`@keyframes ${mechanism}`));
});
