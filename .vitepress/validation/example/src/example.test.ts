import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { captureValidation } from './capture.ts';

test('recorded outcomes match real RPCs through the validation interceptor', async () => {
    const observed = await captureValidation();
    const recorded = JSON.parse(readFileSync(new URL('../../recording.json', import.meta.url), 'utf8'));
    assert.deepEqual(observed, recorded);
    assert.deepEqual(
        observed.records.map(({ validation }) => ({ passed: validation.passed, rules: validation.issues.map(({ rule }) => rule) })),
        [
            { passed: true, rules: [] },
            { passed: false, rules: ['int32.gt'] },
            { passed: false, rules: ['string.min_len'] },
            { passed: true, rules: [] },
        ],
    );
    assert.deepEqual(
        observed.records.map(({ code, handlerCalls }) => ({ code, handlerCalls })),
        [
            { code: 'OK', handlerCalls: 1 },
            { code: 'InvalidArgument', handlerCalls: 0 },
            { code: 'InvalidArgument', handlerCalls: 0 },
            { code: 'NotFound', handlerCalls: 1 },
        ],
    );
});
