const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export { escapeHtml };

export function text(x, y, value, kind = 'name', anchor = 'start') {
    return `<text class="go-${kind}" x="${x}" y="${y}" text-anchor="${anchor}">${escapeHtml(value)}</text>`;
}

export function zone(x, y, width, height, label) {
    return `<g class="go-zone"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8"/>${label ? text(x + 16, y + 24, label, 'heading') : ''}</g>`;
}

export function node(id, x, y, width, height, name, details = [], options = {}) {
    const { focal = false, topics = [], shape = 'box' } = options;
    if (!['box', 'document', 'state', 'decision'].includes(shape)) throw new Error(`Unknown node shape: ${shape}`);
    const bounds = `x="${x}" y="${y}" width="${width}" height="${height}"`;
    const outline =
        shape === 'decision'
            ? `<path class="go-surface" d="M${x + width / 2} ${y}L${x + width} ${y + height / 2}L${x + width / 2} ${y + height}L${x} ${y + height / 2}Z"/>`
            : shape === 'document'
              ? `<path class="go-surface" d="M${x} ${y}H${x + width - 16}L${x + width} ${y + 16}V${y + height}H${x}Z"/><path class="go-fold" d="M${x + width - 16} ${y}V${y + 16}H${x + width}"/>`
              : `<rect class="go-surface" ${bounds} rx="${shape === 'state' ? 20 : 6}"/>`;
    const nameLines = Array.isArray(name) ? name : [name];
    const first = y + (height - ((nameLines.length - 1) * 20 + details.length * 20)) / 2 + 6;
    const labelX = shape === 'decision' ? x + width / 2 : x + 16;
    const anchor = shape === 'decision' ? 'middle' : 'start';
    return `<g data-node="${escapeHtml(id)}" data-box="${x} ${y} ${width} ${height}" data-topics="${topics.map(escapeHtml).join(' ')}"${focal ? ' data-focal=""' : ''}>${outline}${nameLines.map((line, index) => text(labelX, first + index * 20, line, 'name', anchor)).join('')}${details.map((line, index) => text(labelX, first + (nameLines.length + index) * 20, line, 'detail', anchor)).join('')}</g>`;
}

// explicit authored waypoints keep topic layouts independent of a graph renderer.
export function edge(points, options = {}) {
    const { arrow = true, dashed = false, from = '', to = '' } = options;
    if (points.length < 2) throw new Error('A connector needs two endpoints');
    for (let i = 1; i < points.length; i++) {
        const [a, b] = [points[i - 1], points[i]];
        if ((a[0] === b[0]) === (a[1] === b[1])) throw new Error(`Non-orthogonal or empty segment: ${points}`);
    }
    let d = `M${points[0].join(' ')}`;
    for (let i = 1; i < points.length - 1; i++) {
        const [before, at, after] = [points[i - 1], points[i], points[i + 1]];
        const incoming = Math.abs(at[0] - before[0]) + Math.abs(at[1] - before[1]);
        const outgoing = Math.abs(after[0] - at[0]) + Math.abs(after[1] - at[1]);
        const r = Math.min(8, incoming / 2, outgoing / 2);
        const p = [at[0] - Math.sign(at[0] - before[0]) * r, at[1] - Math.sign(at[1] - before[1]) * r];
        const q = [at[0] + Math.sign(after[0] - at[0]) * r, at[1] + Math.sign(after[1] - at[1]) * r];
        d += ` L${p.join(' ')} Q${at.join(' ')} ${q.join(' ')}`;
    }
    d += ` L${points.at(-1).join(' ')}`;
    return `<path class="go-edge${dashed ? ' go-dashed' : ''}" data-from="${escapeHtml(from)}" data-to="${escapeHtml(to)}" data-points="${points.map((point) => point.join(',')).join(' ')}" d="${d}"${arrow ? ' marker-end="url(#GUIDE_SLUG-arrow)"' : ''}/>`;
}

export function note(x, y, lines) {
    return lines.map((line, index) => text(x, y + index * 20, line, 'detail')).join('');
}

export function label(x, y, value) {
    if (value.length > 14 || value !== value.toUpperCase()) throw new Error(`Connector label must be uppercase and short: ${value}`);
    const width = Math.ceil((value.length * 7 + 16) / 4) * 4;
    return `<g class="go-label" data-label-box="${x - width / 2} ${y - 12} ${width} 20"><rect x="${x - width / 2}" y="${y - 12}" width="${width}" height="20"/>${text(x, y + 2, value, 'tag', 'middle')}</g>`;
}
