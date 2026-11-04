import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const model = {
    // keep geometry at native scale; crop empty margins to the article width.
    width: 688,
    height: 440,
    frameX: 84,
    origin: [304, 220],
    size: 184,
    radius: 12,
    thickness: 20,
    gap: 60,
    labelX: 576,
    parts: [
        { key: 'runtime', name: 'Server runtime', detail: 'createServer · start · stop', level: 0 },
        { key: 'services', name: 'Your services', detail: 'typed RPC handlers', level: 1, focal: true },
        { key: 'extensions', name: 'Optional extensions', detail: 'interceptors · protocols', level: 2 },
    ],
};

export function project(x, y, z) {
    return [model.origin[0] + x - y, model.origin[1] + (x + y) / 2 - z];
}

const number = (value) => Number(value.toFixed(3));
const point = (value) => value.map(number).join(' ');
const move = (value) => `M ${point(value)}`;
const line = (value) => `L ${point(value)}`;
const arc = (value, sweep = 1) => `A ${number(model.radius * Math.SQRT2)} ${number(model.radius / Math.SQRT2)} 0 0 ${sweep} ${point(value)}`;

export function partGeometry(level) {
    const { size: s, radius: r, thickness: t, gap } = model;
    const z = level * (gap + t);
    const top = z + t;
    const extreme = r * (2 - Math.SQRT2);
    const frontInset = r * (1 - 1 / Math.SQRT2);
    const vertices = (height) => ({
        left: project(extreme / 2, s - extreme / 2, height),
        leftBack: project(0, s - r, height),
        backLeft: project(0, r, height),
        backRight: project(r, 0, height),
        rightBack: project(s - r, 0, height),
        right: project(s - extreme / 2, extreme / 2, height),
        rightFront: project(s, r, height),
        frontRight: project(s, s - r, height),
        front: project(s - frontInset, s - frontInset, height),
        frontLeft: project(s - r, s, height),
        leftFront: project(r, s, height),
    });
    const a = vertices(top);
    const b = vertices(z);
    const back = [move(a.left), arc(a.leftBack), line(a.backLeft), arc(a.backRight), line(a.rightBack), arc(a.right)];
    return {
        z,
        right: a.right,
        labelY: a.right[1] + t / 2,
        silhouette: [...back, line(b.right), arc(b.rightFront), line(b.frontRight), arc(b.frontLeft), line(b.leftFront), arc(b.left), 'Z'].join(' '),
        top: [...back, arc(a.rightFront), line(a.frontRight), arc(a.frontLeft), line(a.leftFront), arc(a.left), 'Z'].join(' '),
        left: [move(a.left), arc(a.leftFront, 0), line(a.frontLeft), arc(a.front, 0), line(b.front), arc(b.frontLeft), line(b.leftFront), arc(b.left), 'Z'].join(' '),
        rightFace: [move(a.front), arc(a.frontRight, 0), line(a.rightFront), arc(a.right, 0), line(b.right), arc(b.rightFront), line(b.frontRight), arc(b.front), 'Z'].join(' '),
        rim: [move(a.left), arc(a.leftFront, 0), line(a.frontLeft), arc(a.frontRight, 0), line(a.rightFront), arc(a.right, 0)].join(' '),
    };
}

function renderPart(part) {
    const geometry = partGeometry(part.level);
    const [rightX] = geometry.right;
    const y = geometry.labelY;
    return `
          <g data-part="${part.key}" data-name="${part.name}" data-rect="0 0 ${model.size} ${model.size} ${model.radius}" data-z="${geometry.z}" data-t="${model.thickness}" data-level="${part.level}"${part.focal ? ' data-focal' : ''}>
            <path data-role="silhouette" class="sc-base" d="${geometry.silhouette}"/>
            <path class="sc-top" d="${geometry.top}"/>
            <path class="sc-left" d="${geometry.left}"/>
            <path class="sc-right" d="${geometry.rightFace}"/>
            <path class="sc-rim" d="${geometry.rim}"/>
            <path class="sc-outline" d="${geometry.silhouette}"/>
            <g data-role="label">
              <line data-role="leader" class="sc-leader" x1="${number(rightX + 6)}" y1="${number(y)}" x2="${model.labelX - 12}" y2="${number(y)}"/>
              <circle class="sc-dot" cx="${number(rightX)}" cy="${number(y)}" r="2"/>
              <text data-role="name" class="sc-name" x="${model.labelX}" y="${number(y - 4)}">${part.name}</text>
              <text class="sc-detail" x="${model.labelX}" y="${number(y + 16)}">${part.detail}</text>
            </g>
          </g>`;
}

export function renderSvg() {
    const lower = partGeometry(0);
    const upper = partGeometry(2);
    const right = lower.right[0];
    const left = model.origin[0] * 2 - right;
    return `<svg class="server-composition" viewBox="${model.frameX} 0 ${model.width} ${model.height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="server-composition-title server-composition-desc">
        <title id="server-composition-title">Compose one Connectum server</title>
        <desc id="server-composition-desc">createServer provides the server runtime for your typed RPC handlers, with optional interceptors and protocol plugins.</desc>
        <defs>
          <style>
            .server-composition {
              --sc-paper: var(--connectum-diagram-node, #fff);
              --sc-ink: var(--connectum-diagram-text, #3c3c43);
              --sc-muted: var(--connectum-diagram-muted, #67676c);
              --sc-accent: #3153a0;
              --sc-blue-surface: #eaf0ff;
              --sc-blue-border: #6078aa;
              --sc-blue-left: #9aaee2;
              --sc-blue-right: #345bc4;
            }
            .dark .server-composition, body:has(#server-theme-dark:checked) .server-composition {
              --sc-paper: #1b1b1f;
              --sc-ink: #dfdfd6;
              --sc-muted: #a4a4ab;
              --sc-accent: #b9cdff;
              --sc-blue-surface: #202b43;
              --sc-blue-border: #7f9cd4;
              --sc-blue-left: #18223a;
              --sc-blue-right: #111a2d;
            }
            .server-composition .sc-base, .server-composition .sc-top { fill: var(--sc-paper); }
            .server-composition .sc-left { fill: color-mix(in srgb, var(--sc-ink) 7%, var(--sc-paper)); }
            .server-composition .sc-right { fill: color-mix(in srgb, var(--sc-ink) 15%, var(--sc-paper)); }
            .server-composition .sc-outline { fill: none; stroke: var(--sc-ink); stroke-width: 1.2; stroke-linejoin: round; }
            .server-composition .sc-rim { fill: none; stroke: var(--sc-ink); stroke-opacity: .55; stroke-width: .8; }
            .server-composition .sc-trace { stroke: var(--sc-ink); stroke-opacity: .3; stroke-width: .8; stroke-dasharray: 4 3; }
            .server-composition .sc-leader { stroke: var(--sc-ink); stroke-opacity: .4; stroke-width: .8; }
            .server-composition .sc-dot { fill: var(--sc-ink); }
            .server-composition .sc-name { fill: var(--sc-ink); font: 600 16px Inter, ui-sans-serif, system-ui, sans-serif; }
            .server-composition .sc-detail { fill: var(--sc-muted); font: 400 10px ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; letter-spacing: .08em; }
            .dark .server-composition .sc-base, body:has(#server-theme-dark:checked) .sc-base { fill: #202127; }
            .dark .server-composition .sc-top, body:has(#server-theme-dark:checked) .sc-top { fill: color-mix(in srgb, var(--sc-ink) 10%, #202127); }
            .dark .server-composition .sc-left, body:has(#server-theme-dark:checked) .sc-left { fill: #202127; }
            .dark .server-composition .sc-right, body:has(#server-theme-dark:checked) .sc-right { fill: color-mix(in srgb, var(--sc-paper) 45%, #202127); }
            .server-composition [data-focal] .sc-top, .dark .server-composition [data-focal] .sc-top, body:has(#server-theme-dark:checked) [data-focal] .sc-top { fill: var(--sc-blue-surface); }
            .server-composition [data-focal] .sc-left, .dark .server-composition [data-focal] .sc-left, body:has(#server-theme-dark:checked) [data-focal] .sc-left { fill: var(--sc-blue-left); }
            .server-composition [data-focal] .sc-right, .dark .server-composition [data-focal] .sc-right, body:has(#server-theme-dark:checked) [data-focal] .sc-right { fill: var(--sc-blue-right); }
            .server-composition [data-focal] .sc-outline, .server-composition [data-focal] .sc-rim { stroke: var(--sc-blue-border); }
            .server-composition [data-focal] .sc-leader { stroke: var(--sc-accent); }
            .server-composition [data-focal] .sc-dot, .server-composition [data-focal] .sc-detail { fill: var(--sc-accent); }
          </style>
        </defs>
        <g data-exploded data-origin="${model.origin.join(' ')}" data-gap="${model.gap}">
          <line class="sc-trace" data-role="trace" x1="${number(left)}" y1="${number(lower.right[1])}" x2="${number(left)}" y2="${number(upper.right[1] + model.thickness)}"/>
          <line class="sc-trace" data-role="trace" x1="${number(right)}" y1="${number(lower.right[1])}" x2="${number(right)}" y2="${number(upper.right[1] + model.thickness)}"/>
${model.parts.map(renderPart).join('\n')}
        </g>
      </svg>`;
}

export function renderHtml() {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Compose one Connectum server</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;display=swap">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px 24px; color: #3c3c43; background: #fff; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    body:has(#server-theme-dark:checked) { color: #dfdfd6; background: #1b1b1f; color-scheme: dark; }
    main { width: 100%; max-width: 688px; min-width: 0; margin: auto; }
    h1 { font-size: 28px; font-weight: 600; }
    label { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; cursor: pointer; }
    figure { margin: 16px 0; }
    .diagram-container { width: 100%; overflow-x: auto; }
    svg { display: block; width: 100%; min-width: 688px; }
    figcaption { margin-top: 12px; font-size: 14px; line-height: 1.6; }
    @media print { .diagram-container { overflow-x: visible; } svg { min-width: 0; } label { display: none; } }
  </style>
</head>
<body>
  <main>
    <h1>Compose one Connectum server</h1>
    <label><input type="checkbox" id="server-theme-dark">Dark theme</label>
    <figure>
      <section class="diagram-container" tabindex="0" aria-label="Server composition diagram; scroll horizontally">
        ${renderSvg()}
      </section>
      <figcaption>The plates show server composition, not RPC execution order. In-process clients can use registered services before a network listener starts.</figcaption>
    </figure>
  </main>
</body>
</html>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    writeFileSync(new URL('../.vitepress/theme/assets/diagrams/server-composition.html', import.meta.url), renderHtml());
}
