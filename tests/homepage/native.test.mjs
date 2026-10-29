import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { commandTyped, loopFrame, selectedScene } from '../../.vitepress/homepage/player.mjs';

const data = JSON.parse(await readFile(new URL('../../.vitepress/homepage/native.json', import.meta.url), 'utf8'));

test('code, controls and typing use the same native timeline snapshot', () => {
    assert.equal(data.scenes.length, 5);
    for (const [index, scene] of data.scenes.entries()) {
        assert.equal(selectedScene(scene.start, data.scenes), scene);
        assert.equal(selectedScene(scene.start + scene.duration - 1, data.scenes), scene);
        if (index > 0) assert.equal(data.scenes[index - 1].start + data.scenes[index - 1].duration, scene.start);
    }
    assert.equal(data.durationInFrames, data.scenes.at(-1).start + data.scenes.at(-1).duration);
});

test('typing completes before console responses appear and preserves a reading hold', () => {
    for (const example of data.scenes[4].examples) {
        const count = [...example.code.replaceAll('\n', '')].length;
        assert.equal(commandTyped(example.typingStart - 1, example.typingStart, example.typingFrames, count), 0);
        assert.equal(commandTyped(example.resultAt, example.typingStart, example.typingFrames, count), count);
        assert.ok(example.resultAt > example.typingStart + example.typingFrames);
        assert.ok(example.typingFrames >= count);
    }
    assert.ok(data.scenes[4].duration - data.scenes[4].examples.at(-1).resultAt >= 30);
});

test('native loop wraps continuously without changing the active-slide rule', () => {
    const durationMs = (data.durationInFrames / data.fps) * 1000;
    assert.ok(loopFrame(durationMs - 10, data.fps, data.durationInFrames) > data.durationInFrames - 1);
    assert.equal(loopFrame(durationMs, data.fps, data.durationInFrames), 0);
    assert.equal(selectedScene(loopFrame(durationMs + 10, data.fps, data.durationInFrames), data.scenes), data.scenes[0]);
});
