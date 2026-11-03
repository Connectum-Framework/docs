import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { captureInterceptors } from './capture.ts';

test('all six interceptor compositions and outcomes match real HTTP RPCs', async () => {
    const observed = await captureInterceptors();
    const recorded = JSON.parse(readFileSync(new URL('../../recording.json', import.meta.url), 'utf8'));
    assert.deepEqual(observed, recorded);
    assert.equal(observed.records.length, 6);
    for (const { settings, result } of observed.records) {
        assert.equal(result.handlerCalls, 1);
        assert.equal(result.code, settings.outcome === 'success' ? 'OK' : 'NotFound');
        assert.equal(result.sourceHeader, settings.outcome === 'success' && settings.chain !== 'audit-only' ? 'fixture' : null);
        if (settings.outcome === 'failure') assert.ok(result.events.every((entry) => !entry.includes('after')));
    }
});
