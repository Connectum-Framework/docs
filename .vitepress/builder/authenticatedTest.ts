export const authenticatedTest = `import assert from "node:assert/strict";
import { test } from "node:test";
import { createTestJwtRS256, generateRsaTestKeypair, startTestJwksServer } from "@connectum/auth/testing";
import { Code, ConnectError, createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import type { Server } from "@connectum/core";
import { GreeterService } from "#gen/greeter/v1/greeter_pb.ts";
import { buildServer } from "#server.ts";

test("protected SayHello verifies JWTs through JWKS over gRPC", { timeout: 15000 }, async () => {
    const keys = await generateRsaTestKeypair();
    const jwks = await startTestJwksServer(keys.publicJwk);
    const previous = { JWKS_URI: process.env.JWKS_URI, JWT_ISSUER: process.env.JWT_ISSUER, JWT_AUDIENCE: process.env.JWT_AUDIENCE };
    let server: Server | undefined;
    try {
        process.env.JWKS_URI = jwks.url;
        process.env.JWT_ISSUER = "https://issuer.example.test";
        process.env.JWT_AUDIENCE = "greeter-test";
        server = buildServer(0);
        await server.start();
        const client = createClient(GreeterService, createGrpcTransport({ baseUrl: "http://127.0.0.1:" + server.address?.port }));
        const options = { kid: keys.kid, issuer: process.env.JWT_ISSUER, audience: process.env.JWT_AUDIENCE };
        const token = await createTestJwtRS256(keys.privateKey, { sub: "reader" }, options);
        const header = { authorization: "Bearer " + token };
        const response = await client.sayHello({ name: "Ada" }, { headers: header, timeoutMs: 5000 });
        assert.equal(response.message, "Hello, Ada!");
        const unauthenticated = (error: unknown) => error instanceof ConnectError && error.code === Code.Unauthenticated;
        await assert.rejects(() => client.sayHello({ name: "Ada" }, { timeoutMs: 5000 }), unauthenticated);
        await assert.rejects(() => client.sayHello({ name: "Ada" }, { headers: { authorization: "Bearer invalid" }, timeoutMs: 5000 }), unauthenticated);
        const wrongIssuer = await createTestJwtRS256(keys.privateKey, { sub: "reader" }, { ...options, issuer: "https://wrong.example.test" });
        await assert.rejects(() => client.sayHello({ name: "Ada" }, { headers: { authorization: "Bearer " + wrongIssuer }, timeoutMs: 5000 }), unauthenticated);
        // SayGoodbye has no allow rule, so valid credentials alone must not grant access.
        await assert.rejects(() => client.sayGoodbye({ name: "Ada" }, { headers: header, timeoutMs: 5000 }),
            (error: unknown) => error instanceof ConnectError && error.code === Code.PermissionDenied);
    } finally {
        if (server?.state === "running") await server.stop();
        await jwks.close();
        for (const [name, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[name];
            else process.env[name] = value;
        }
    }
});
`;
