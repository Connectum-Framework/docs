import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { toJson } from '@bufbuild/protobuf';
import { Code, ConnectError, createClient } from '@connectrpc/connect';
import { createConnectTransport, createGrpcTransport } from '@connectrpc/connect-node';
import { createTestJwtRS256, generateRsaTestKeypair, startTestJwksServer } from '@connectum/auth/testing';
import { Health } from '#gen/grpc/health/v1/health_pb.ts';
import { ServerReflection } from '#gen/grpc/reflection/v1/reflection_pb.ts';
import { GetPageResponseSchema, PageService } from '#gen/page/v1/page_pb.ts';
import { credentials, requestSources } from '../../requests/variants.ts';

const keys = await generateRsaTestKeypair();
const jwks = await startTestJwksServer(keys.publicJwk);
let log = '';
const child = spawn(process.execPath, ['src/index.ts'], {
    cwd: new URL('../../', import.meta.url),
    env: {
        ...process.env,
        PORT: '0',
        JWKS_URI: jwks.url,
        JWT_ISSUER: 'https://issuer.example.test',
        JWT_AUDIENCE: 'private-page',
        OTEL_TRACES_EXPORTER: 'console',
        OTEL_METRICS_EXPORTER: 'none',
        OTEL_LOGS_EXPORTER: 'none',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
});
const exited = once(child, 'exit');
child.stdout.on('data', (chunk) => {
    log += chunk;
});
child.stderr.on('data', (chunk) => {
    log += chunk;
});

try {
    const port = await new Promise<number>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(`Server startup timed out: ${log}`)), 15_000);
        const read = () => {
            const match = /ready on .*:(\d+)/.exec(log);
            if (!match) return;
            clearTimeout(timeout);
            resolve(Number(match[1]));
        };
        child.stdout.on('data', read);
        child.once('error', (error) => {
            clearTimeout(timeout);
            reject(error);
        });
        child.once('exit', (code) => {
            clearTimeout(timeout);
            reject(new Error(`Server exited ${code}: ${log}`));
        });
        read();
    });
    const baseUrl = `http://127.0.0.1:${port}`;
    const token = await createTestJwtRS256(keys.privateKey, { sub: 'reader' }, { kid: keys.kid, issuer: 'https://issuer.example.test', audience: 'private-page' });
    const headers = { authorization: `Bearer ${token}` };
    const connect = createClient(PageService, createConnectTransport({ baseUrl, httpVersion: '2' }));
    const grpc = createClient(PageService, createGrpcTransport({ baseUrl }));
    const response = toJson(GetPageResponseSchema, await connect.getPage({}, { headers, timeoutMs: 5000 }));
    assert.deepEqual(response, { title: 'Your private page', body: 'This content requires a verified JWT.' });
    assert.deepEqual(toJson(GetPageResponseSchema, await grpc.getPage({}, { headers, timeoutMs: 5000 })), response);
    const commands = requestSources(readFileSync(new URL('../../requests/get-page.sh', import.meta.url), 'utf8'), `127.0.0.1:${port}`);
    const curlResults: Record<string, { status: number; body: unknown }> = {};
    for (const credential of credentials) {
        const { stdout } = await promisify(execFile)('bash', ['-c', `${commands.curl[credential.id]} --write-out '\\n%{http_code}'`], {
            env: { ...process.env, TOKEN: token },
            timeout: 5000,
        });
        const split = stdout.lastIndexOf('\n');
        curlResults[credential.id] = { status: Number(stdout.slice(split + 1)), body: JSON.parse(stdout.slice(0, split)) };
    }
    assert.deepEqual(curlResults.successful, { status: 200, body: response });
    const denied = async (client: typeof connect, header?: string) => {
        try {
            await client.getPage({}, { headers: header ? { authorization: header } : undefined, timeoutMs: 5000 });
            assert.fail('Protected content was returned without valid credentials.');
        } catch (error) {
            assert.ok(error instanceof ConnectError);
            assert.equal(error.code, Code.Unauthenticated);
            return { code: 'Unauthenticated', message: error.rawMessage };
        }
    };
    const missing = await denied(connect);
    const invalid = await denied(connect, 'Bearer invalid');
    const grpcMissing = await denied(grpc);
    const grpcInvalid = await denied(grpc, 'Bearer invalid');
    assert.deepEqual(curlResults.missing, { status: 401, body: { code: 'unauthenticated', message: missing.message } });
    assert.deepEqual(curlResults.invalid, { status: 401, body: { code: 'unauthenticated', message: invalid.message } });
    const health = await createClient(Health, createGrpcTransport({ baseUrl })).check({}, { timeoutMs: 5000 });
    assert.equal(health.status, 1);
    async function* requests() {
        yield { messageRequest: { case: 'listServices' as const, value: '' } };
    }
    const reflected: string[] = [];
    for await (const response of createClient(ServerReflection, createGrpcTransport({ baseUrl })).serverReflectionInfo(requests(), { timeoutMs: 5000 })) {
        assert.equal(response.messageResponse.case, 'listServicesResponse');
        if (response.messageResponse.case === 'listServicesResponse') reflected.push(...response.messageResponse.value.service.map((service) => service.name));
    }
    assert.ok(reflected.includes('page.v1.PageService'));
    child.kill('SIGTERM');
    const timeout = setTimeout(() => child.kill('SIGKILL'), 15_000);
    const [exitCode, exitSignal] = await exited;
    clearTimeout(timeout);
    assert.equal(exitSignal, null, 'The application must shut down without forced termination.');
    assert.equal(exitCode, 0, 'The application must flush telemetry and exit successfully.');
    const spans = [...new Set([...log.matchAll(/\bname:\s*'([^']+)'/g)].map((match) => match[1]).filter((name) => name === 'page.v1.PageService/GetPage'))];
    assert.deepEqual(spans, ['page.v1.PageService/GetPage']);
    const observed = {
        successful: { code: 'OK', response, protocols: ['Connect HTTP/2', 'gRPC'], curl: true },
        missing,
        invalid,
        health: { status: 'SERVING' },
        reflection: { services: reflected.sort() },
        otel: { exporter: 'console', spans },
        wire: {
            curl: curlResults,
            grpc: {
                successful: { code: 'OK', body: response },
                missing: { code: grpcMissing.code, body: { code: grpcMissing.code, message: grpcMissing.message } },
                invalid: { code: grpcInvalid.code, body: { code: grpcInvalid.code, message: grpcInvalid.message } },
            },
        },
    };
    writeFileSync(new URL('../../../recording.json', import.meta.url), `${JSON.stringify(observed, null, 2)}\n`);
    console.log(JSON.stringify(observed));
} finally {
    if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL');
        await exited;
    }
    await jwks.close();
    writeFileSync(new URL('../../verification.log', import.meta.url), log);
}
