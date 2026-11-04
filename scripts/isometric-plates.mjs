// server composition is the visual reference; all isometric plates share its geometry and skin.
export const plateModel = { size: 184, radius: 12, thickness: 20, gap: 60 };

export function project(x, y, z, origin) {
    return [origin[0] + x - y, origin[1] + (x + y) / 2 - z];
}

const number = (value) => Number(value.toFixed(3));
const point = (value) => value.map(number).join(' ');
const move = (value) => `M ${point(value)}`;
const line = (value) => `L ${point(value)}`;
const arc = (value, sweep = 1) => `A ${number(plateModel.radius * Math.SQRT2)} ${number(plateModel.radius / Math.SQRT2)} 0 0 ${sweep} ${point(value)}`;

export function partGeometry(level, origin) {
    const { size: s, radius: r, thickness: t, gap } = plateModel;
    const z = level * (gap + t);
    const top = z + t;
    const extreme = r * (2 - Math.SQRT2);
    const frontInset = r * (1 - 1 / Math.SQRT2);
    const vertices = (height) => ({
        left: project(extreme / 2, s - extreme / 2, height, origin),
        leftBack: project(0, s - r, height, origin),
        backLeft: project(0, r, height, origin),
        backRight: project(r, 0, height, origin),
        rightBack: project(s - r, 0, height, origin),
        right: project(s - extreme / 2, extreme / 2, height, origin),
        rightFront: project(s, r, height, origin),
        frontRight: project(s, s - r, height, origin),
        front: project(s - frontInset, s - frontInset, height, origin),
        frontLeft: project(s - r, s, height, origin),
        leftFront: project(r, s, height, origin),
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

export function renderPlateFaces(geometry) {
    return `<path data-role="silhouette" class="sc-base" d="${geometry.silhouette}"/>
            <path class="sc-top" d="${geometry.top}"/>
            <path class="sc-left" d="${geometry.left}"/>
            <path class="sc-right" d="${geometry.rightFace}"/>
            <path class="sc-rim" d="${geometry.rim}"/>
            <path class="sc-outline" d="${geometry.silhouette}"/>`;
}

function darkStyles(scope) {
    return `${scope} {
              --sc-paper: #1b1b1f;
              --sc-ink: #dfdfd6;
              --sc-muted: #a4a4ab;
              --sc-accent: #b9cdff;
              --sc-blue-surface: #202b43;
              --sc-blue-border: #7f9cd4;
              --sc-blue-left: #18223a;
              --sc-blue-right: #111a2d;
            }
            ${scope} .sc-base { fill: #202127; }
            ${scope} .sc-top { fill: color-mix(in srgb, var(--sc-ink) 10%, #202127); }
            ${scope} .sc-left { fill: #202127; }
            ${scope} .sc-right { fill: color-mix(in srgb, var(--sc-paper) 45%, #202127); }`;
}

export const plateStyles = `
            .connectum-isometric {
              --sc-paper: var(--connectum-diagram-node, #fff);
              --sc-ink: var(--connectum-diagram-text, #3c3c43);
              --sc-muted: var(--connectum-diagram-muted, #67676c);
              --sc-accent: #3153a0;
              --sc-blue-surface: #eaf0ff;
              --sc-blue-border: #6078aa;
              --sc-blue-left: #9aaee2;
              --sc-blue-right: #345bc4;
            }
            .connectum-isometric .sc-base, .connectum-isometric .sc-top { fill: var(--sc-paper); }
            .connectum-isometric .sc-left { fill: color-mix(in srgb, var(--sc-ink) 7%, var(--sc-paper)); }
            .connectum-isometric .sc-right { fill: color-mix(in srgb, var(--sc-ink) 15%, var(--sc-paper)); }
            .connectum-isometric .sc-outline { fill: none; stroke: var(--sc-ink); stroke-width: 1.2; stroke-linejoin: round; }
            .connectum-isometric .sc-rim { fill: none; stroke: var(--sc-ink); stroke-opacity: .55; stroke-width: .8; }
            .connectum-isometric .sc-trace { stroke: var(--sc-ink); stroke-opacity: .3; stroke-width: .8; stroke-dasharray: 4 3; }
            .connectum-isometric .sc-leader { stroke: var(--sc-ink); stroke-opacity: .4; stroke-width: .8; }
            .connectum-isometric .sc-dot { fill: var(--sc-ink); }
            .connectum-isometric .sc-name { fill: var(--sc-ink); font: 600 16px Inter, ui-sans-serif, system-ui, sans-serif; }
            .connectum-isometric .sc-detail { fill: var(--sc-muted); font: 400 10px ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; letter-spacing: .08em; }
            ${darkStyles(':where(.dark, body:has(#server-theme-dark:checked)) .connectum-isometric')}
            @media (prefers-color-scheme: dark) {
              ${darkStyles(':where(body.isometric-standalone) .connectum-isometric')}
            }
            .connectum-isometric [data-focal] .sc-top { fill: var(--sc-blue-surface); }
            .connectum-isometric [data-focal] .sc-left { fill: var(--sc-blue-left); }
            .connectum-isometric [data-focal] .sc-right { fill: var(--sc-blue-right); }
            .connectum-isometric [data-focal] .sc-outline, .connectum-isometric [data-focal] .sc-rim { stroke: var(--sc-blue-border); }
            .connectum-isometric [data-focal] .sc-leader { stroke: var(--sc-accent); }
            .connectum-isometric [data-focal] .sc-dot, .connectum-isometric [data-focal] .sc-detail { fill: var(--sc-accent); }
`;
