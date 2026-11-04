import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { partGeometry, plateStyles, renderPlateFaces } from './isometric-plates.mjs';

export const model = {
    origin: [208, 20],
    viewBox: '0 0 416 204',
    parts: [
        {
            key: 'connectum',
            name: 'Connectum',
            focal: true,
            items: [
                '<code>defineService()</code> binds your handlers.',
                '<code>createServer()</code> registers and runs services.',
                'Server lifecycle and interceptor composition.',
            ],
            note: 'Your handlers contain the business logic.',
        },
        {
            key: 'connectrpc',
            name: 'ConnectRPC',
            items: ['gRPC, Connect and gRPC-Web protocols.', 'Unary and streaming RPC calls.', 'HTTP/1.1 and HTTP/2 transports.'],
            note: 'Native gRPC and bidirectional streams require HTTP/2.',
        },
        {
            key: 'protobuf',
            name: 'Protobuf',
            items: [
                '<code>.proto</code> services, RPC methods and messages.',
                'One contract for clients and servers.',
                '<code>protobuf-es</code> generates TypeScript descriptors and message types.',
            ],
        },
    ],
};

function renderPart(part) {
    return `<section class="stack-layer stack-layer--${part.key}" aria-labelledby="technology-stack-${part.key}-title">
                    <div class="stack-block" aria-hidden="true">
                        <svg viewBox="${model.viewBox}" aria-hidden="true" focusable="false">
                            <g data-part="${part.key}"${part.focal ? ' data-focal' : ''}>
                                ${renderPlateFaces(partGeometry(0, model.origin))}
                            </g>
                        </svg>
                    </div>
                    <div class="stack-details">
                        <h3 id="technology-stack-${part.key}-title">${part.name}</h3>
                        <ul>
                            ${part.items.map((item) => `<li>${item}</li>`).join('\n                            ')}
                        </ul>${part.note ? `\n                        <p class="stack-note">${part.note}</p>` : ''}
                    </div>
                </section>`;
}

export function renderHtml() {
    return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Connectum technology stack</title>
        <style>
        body {
            max-width: 800px;
            margin: 40px auto;
            padding: 0 24px;
            background: #fff;
        }
        @media (prefers-color-scheme: dark) {
            body {
                --vp-c-bg: #1b1b1f;
                --vp-c-text-1: #dfdfd6;
                --vp-c-text-2: #a6a6ad;
                background: #1b1b1f;
            }
        }
        </style>
    </head>
    <body class="isometric-standalone">
        <figure class="connectum-stack connectum-isometric" aria-label="Connectum technology stack">
            <style>
${plateStyles}
            .connectum-stack {
                --stack-paper: var(--vp-c-bg, #fff);
                --stack-ink: var(--vp-c-text-1, #3c3c43);
                --stack-muted: var(--vp-c-text-2, #67676c);
                margin: 24px 0 40px;
                color: var(--stack-ink);
                font-family: var(--vp-font-family-base, "Inter", ui-sans-serif, system-ui, sans-serif);
            }
            .connectum-stack .stack-layers {
                display: grid;
                gap: 4px;
            }
            .connectum-stack .stack-layer {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
                align-items: center;
                gap: 28px;
                break-inside: avoid;
            }
            .connectum-stack .stack-block {
                min-width: 0;
            }
            .connectum-stack .stack-block svg {
                display: block;
                width: 100%;
                height: auto;
            }
            .connectum-stack .stack-details {
                min-width: 0;
            }
            .connectum-stack .stack-details h3 {
                margin: 0 0 8px;
                border: 0;
                padding: 0;
                color: var(--stack-ink);
                font-size: 23px;
                font-weight: 650;
                line-height: 1.3;
                letter-spacing: -0.4px;
            }
            .connectum-stack .stack-layer--connectum h3 {
                color: var(--sc-accent);
            }
            .connectum-stack .stack-details ul {
                margin: 0;
                padding-left: 18px;
                font-size: 15px;
                line-height: 1.65;
            }
            .connectum-stack .stack-details li {
                margin: 3px 0;
            }
            .connectum-stack .stack-details code {
                border-radius: 4px;
                padding: 1px 4px;
                background: color-mix(in srgb, var(--sc-accent) 8%, var(--stack-paper));
                color: inherit;
                font-family: var(--vp-font-family-mono, ui-monospace, monospace);
                font-size: 0.9em;
            }
            .connectum-stack .stack-note {
                margin: 8px 0 0;
                color: var(--stack-muted);
                font-size: 14px;
                line-height: 1.6;
            }
            .connectum-stack figcaption {
                margin: 24px 0 0;
                color: var(--stack-muted);
                font-size: 14px;
                line-height: 1.65;
            }
            @media (max-width: 640px) {
                .connectum-stack .stack-layers {
                    gap: 16px;
                }
                .connectum-stack .stack-layer {
                    grid-template-columns: minmax(0, 1fr);
                    gap: 0;
                }
                .connectum-stack .stack-block {
                    width: min(100%, 300px);
                    margin: 0 auto;
                }
                .connectum-stack .stack-details {
                    padding: 0 8px;
                }
                .connectum-stack .stack-details h3 {
                    font-size: 22px;
                }
            }
            @media print {
                .connectum-stack .stack-layer {
                    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
                    gap: 28px;
                }
            }
            </style>
            <div class="stack-layers">
                ${model.parts.map(renderPart).join('\n                ')}
            </div>
            <figcaption>Connectum composes your service on ConnectRPC. Protobuf supplies the shared contract and generated types.</figcaption>
        </figure>
    </body>
</html>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    writeFileSync(new URL('../.vitepress/theme/assets/diagrams/technology-stack.html', import.meta.url), renderHtml());
}
