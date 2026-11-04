import { readFileSync } from 'node:fs';
import { createMarkdownRenderer } from 'vitepress';
import { clients, credentials, requestSources } from './additions/requests/variants.ts';
import openapi from './openapi.json' with { type: 'json' };
import { buildQuickstartProject, initCommand, scaffoldFileTree } from './project.ts';
import recording from './recording.json' with { type: 'json' };

const loader = {
    watch: [
        '.vitepress/quickstart/additions/**/*',
        '.vitepress/quickstart/*.json',
        '.vitepress/quickstart/*.ts',
        '.vitepress/quickstart/generated/*',
        '.vitepress/builder/generated/*',
    ],
    async load() {
        const markdown = await createMarkdownRenderer('.', { lineNumbers: true });
        const block = (text: string, lang = 'typescript') => markdown.render(`\`\`\`${lang}\n${text.trimEnd()}\n\`\`\``);
        const files = buildQuickstartProject();
        const types = readFileSync(new URL('./generated/page_pb.ts', import.meta.url), 'utf8');
        const operation = openapi.paths['/page.v1.PageService/GetPage'].post;
        const commands = requestSources(files['requests/get-page.sh']);
        const requests = clients.flatMap((client) =>
            credentials.map((credential) => {
                const observed = client.id === 'curl' ? recording.wire.curl[credential.id] : recording.wire.grpc[credential.id];
                const status = 'status' in observed ? `HTTP/2 ${observed.status}` : `gRPC ${observed.code === 'OK' ? '0 OK' : `16 ${observed.code}`}`;
                return {
                    client: client.id,
                    credential: credential.id,
                    status,
                    successful: credential.id === 'successful',
                    command: block(commands[client.id][credential.id], 'bash'),
                    response: block(JSON.stringify(observed.body, null, 2), 'json'),
                };
            }),
        );
        return {
            recording,
            clients,
            credentials,
            requests,
            steps: [
                {
                    id: 'init',
                    label: 'Init',
                    file: 'Terminal',
                    title: 'Start with the foundation in place',
                    text: 'Auth and observability are selected here. Health, reflection and graceful shutdown are already in the scaffold.',
                    html: block(`${initCommand}\ncd private-page\npnpm install`, 'bash'),
                    tree: block(scaffoldFileTree(), 'text'),
                },
                {
                    id: 'contract',
                    label: 'Contract',
                    file: 'proto/page/v1/page.proto',
                    title: 'Describe one protected operation',
                    text: 'requires: {} accepts an authenticated caller without asking for additional roles or scopes.',
                    html: block(files['proto/page/v1/page.proto'], 'proto'),
                },
                {
                    id: 'types',
                    label: 'Generate',
                    file: 'Terminal',
                    title: 'Generate the types and descriptors',
                    text: 'Buf generates protobuf code. It does not write the handler or its business logic.',
                    html: block('pnpm exec buf generate', 'bash'),
                    generated: block(types),
                },
                {
                    id: 'handler',
                    label: 'Handler',
                    file: 'src/services/pageService.ts',
                    title: 'Write the handler and register it',
                    text: 'These few lines are handwritten. Authentication stays in the server interceptor chain.',
                    html: block(files['src/services/pageService.ts']),
                },
                {
                    id: 'inspect',
                    label: 'Inspect',
                    file: 'openapi.json · authorization excerpt',
                    title: 'Send a request and inspect the response',
                    text: 'Choose curl or grpcurl and the credentials to send. The emulator returns the captured response for that protocol and JWT.',
                    html: block(
                        JSON.stringify(
                            {
                                paths: { '/page.v1.PageService/GetPage': { post: { security: operation.security } } },
                                components: { securitySchemes: openapi.components.securitySchemes },
                            },
                            null,
                            2,
                        ),
                        'json',
                    ),
                },
            ],
            server: block(files['src/server.ts']),
            auth: block(files['src/auth.ts']),
            openapi: block(JSON.stringify(openapi, null, 2), 'json'),
            start: block(
                'export JWKS_URI="https://your-issuer.example/.well-known/jwks.json"\nexport JWT_ISSUER="https://your-issuer.example"\nexport JWT_AUDIENCE="private-page"\nexport OTEL_TRACES_EXPORTER=console\nexport OTEL_METRICS_EXPORTER=none\nexport OTEL_LOGS_EXPORTER=none\npnpm start',
                'bash',
            ),
            verify: block('pnpm quickstart:generate\nCONNECTUM_FRAMEWORK_ROOT=/path/to/target-framework pnpm quickstart:verify\npnpm quickstart:openapi', 'bash'),
        };
    },
};

export declare const data: Awaited<ReturnType<typeof loader.load>>;
export default loader;
