import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deploymentFrame, deploymentLayout, deployments, routeKind, slideDuration } from '../../.vitepress/homepage/deployment-model.mjs';

test('the same three services are grouped in one, three, then two processes', () => {
    assert.deepEqual(
        deployments.map((deployment) => deployment.groups.length),
        [1, 3, 2],
    );
    for (const deployment of deployments) assert.deepEqual(deployment.groups.flat().sort(), ['avatars', 'profile', 'users']);
    assert.deepEqual(
        deployments.map((deployment) => [routeKind(deployment, 'users'), routeKind(deployment, 'avatars')]),
        [
            ['local', 'local'],
            ['remote', 'remote'],
            ['local', 'remote'],
        ],
    );
});

test('both responsive diagrams contain all service cards inside their real process boundaries', () => {
    for (const compact of [false, true]) {
        const positions = [];
        for (const deployment of deployments) {
            const layout = deploymentLayout(deployment, compact);
            positions.push(layout.cards);
            for (const group of layout.groups) {
                assert.equal(group.kind, group.ids.includes('profile') ? 'local' : 'remote');
                assert.ok(group.x >= 0 && group.y >= 0 && group.x + group.width <= layout.width && group.y + group.height <= layout.height);
                for (const card of layout.cards) {
                    const inside = card.x >= group.x && card.y >= group.y && card.x + card.width <= group.x + group.width && card.y + card.height <= group.y + group.height;
                    assert.equal(inside, group.ids.includes(card.id));
                }
            }
        }
        assert.deepEqual(positions[0], positions[1]);
        assert.deepEqual(positions[1], positions[2]);
    }
});

test('local requests and responses travel faster, remote calls keep their timing, and all deployments loop', () => {
    for (let index = 0; index < deployments.length; index++) {
        const start = index * slideDuration;
        for (const [target, requestAt] of [
            ['users', 600],
            ['avatars', 3200],
        ]) {
            const local = routeKind(deployments[index], target) === 'local';
            const requestDuration = local ? 600 : 1200;
            const responseDuration = local ? 500 : 1000;
            const request = deploymentFrame(start + requestAt + requestDuration / 2);
            assert.equal(request.target, target);
            assert.equal(request.phase, 'request');
            assert.equal(request.fraction, 0.5);
            const responseAt = start + requestAt + requestDuration;
            const response = deploymentFrame(responseAt + responseDuration / 2);
            assert.equal(response.target, target);
            assert.equal(response.phase, 'response');
            assert.equal(response.fraction, 0.5);
            assert.equal(deploymentFrame(responseAt).fraction, 1);
            assert.equal(deploymentFrame(responseAt + responseDuration - 1).phase, 'response');
            assert.equal(deploymentFrame(responseAt + responseDuration).target, null);
        }
        assert.equal(deploymentFrame(start + slideDuration - 1).index, index);
        assert.equal(deploymentFrame(start + slideDuration - 1).phase, 'complete');
        assert.equal(deploymentFrame(start + 1200, true).phase, 'complete');
    }
    assert.deepEqual(deploymentFrame(slideDuration * 3 + 1200), deploymentFrame(1200));
});

test('hybrid timing follows each call route, rather than the slide as a whole', () => {
    const start = slideDuration * 2;
    assert.equal(deploymentFrame(start + 1700).phase, 'users-complete');
    assert.equal(deploymentFrame(start + 3800).target, 'avatars');
    assert.equal(deploymentFrame(start + 3800).phase, 'request');
    assert.equal(deploymentFrame(start + 4900).phase, 'response');
    assert.equal(deploymentFrame(start + 5400).phase, 'complete');
});
