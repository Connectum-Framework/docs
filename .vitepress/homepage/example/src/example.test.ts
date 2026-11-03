import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { test } from 'node:test';
import { promisify } from 'node:util';
import { createClient } from '@connectrpc/connect';
import { createConnectTransport, createGrpcTransport } from '@connectrpc/connect-node';
import { createServer } from '@connectum/core';
import { GreeterService } from '../gen/greeter_pb.ts';
import { greeter } from './greeter.ts';

test('the illustrated handler returns the greeting over real Connect and native gRPC HTTP/2 calls', async () => {
    const server = createServer({ services: [greeter], host: '127.0.0.1', port: 0, allowHTTP1: false, shutdown: { autoShutdown: false } });
    await server.start();
    const address = server.address;
    assert.ok(address && typeof address !== 'string');
    const baseUrl = `http://127.0.0.1:${address.port}`;
    try {
        for (const transport of [createConnectTransport({ baseUrl, httpVersion: '2' }), createGrpcTransport({ baseUrl })]) {
            const response = await createClient(GreeterService, transport).sayHello({ name: 'Alice' });
            assert.equal(response.message, 'Hello, Alice!');
            const changed = await createClient(GreeterService, transport).sayHello({ name: 'Bob' });
            assert.equal(changed.message, 'Hello, Bob!');
        }
        const { stdout } = await promisify(execFile)(
            'curl',
            ['--http2-prior-knowledge', '-fsS', `${baseUrl}/greeter.v1.GreeterService/SayHello`, '-H', 'Content-Type: application/json', '-d', '{"name":"Alice"}'],
            { timeout: 10_000 },
        );
        assert.deepEqual(JSON.parse(stdout), { message: 'Hello, Alice!' });
    } finally {
        await server.stop();
    }
});
