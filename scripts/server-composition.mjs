import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { partGeometry as plateGeometry, plateModel, plateStyles, project as projectPlate, renderPlateFaces } from './isometric-plates.mjs';

export const model = {
    // keep geometry at native scale; crop empty margins to the article width.
    width: 688,
    height: 440,
    frameX: 84,
    origin: [304, 220],
    ...plateModel,
    labelX: 576,
    parts: [
        { key: 'runtime', name: 'Server runtime', detail: 'createServer · start · stop', level: 0 },
        { key: 'services', name: 'Your services', detail: 'typed RPC handlers', level: 1, focal: true },
        { key: 'extensions', name: 'Optional extensions', detail: 'interceptors · protocols', level: 2 },
    ],
};

export function project(x, y, z) {
    return projectPlate(x, y, z, model.origin);
}

const number = (value) => Number(value.toFixed(3));

export function partGeometry(level) {
    return plateGeometry(level, model.origin);
}

function renderPart(part) {
    const geometry = partGeometry(part.level);
    const [rightX] = geometry.right;
    const y = geometry.labelY;
    return `
          <g data-part="${part.key}" data-name="${part.name}" data-rect="0 0 ${model.size} ${model.size} ${model.radius}" data-z="${geometry.z}" data-t="${model.thickness}" data-level="${part.level}"${part.focal ? ' data-focal' : ''}>
            ${renderPlateFaces(geometry)}
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
    return `<svg class="server-composition connectum-isometric" viewBox="${model.frameX} 0 ${model.width} ${model.height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="server-composition-title server-composition-desc">
        <title id="server-composition-title">Compose one Connectum server</title>
        <desc id="server-composition-desc">createServer provides the server runtime for your typed RPC handlers, with optional interceptors and protocol plugins.</desc>
        <defs>
          <style>
${plateStyles}
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
