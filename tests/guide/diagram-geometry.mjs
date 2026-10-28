import assert from 'node:assert/strict';

const attribute = (source, key) => source.match(new RegExp(`${key}="([^"]*)"`))?.[1];

export function geometry(source) {
    const nodes = [...source.matchAll(/<g\s+data-node="[\s\S]*?<\/g>/g)].map(([markup]) => {
        const [x, y, width, height] = attribute(markup, 'data-box').split(' ').map(Number);
        return { id: attribute(markup, 'data-node'), x, y, width, height, topics: attribute(markup, 'data-topics').split(' ').filter(Boolean), markup };
    });
    const edges = [...source.matchAll(/<path\s+class="go-edge[^>]*>/g)].map(([markup]) => ({
        from: attribute(markup, 'data-from'),
        to: attribute(markup, 'data-to'),
        points: attribute(markup, 'data-points')
            .split(' ')
            .map((point) => point.split(',').map(Number)),
        markup,
    }));
    return { nodes, edges };
}

const intersects = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

function segmentCrossesNode([x1, y1], [x2, y2], box) {
    if (x1 === x2) return x1 > box.x && x1 < box.x + box.width && Math.max(y1, y2) > box.y && Math.min(y1, y2) < box.y + box.height;
    return y1 > box.y && y1 < box.y + box.height && Math.max(x1, x2) > box.x && Math.min(x1, x2) < box.x + box.width;
}

function port([x, y], box) {
    if (x > box.x && x < box.x + box.width && (y === box.y || y === box.y + box.height)) return { side: y === box.y ? 'top' : 'bottom', offset: x - box.x };
    if (y > box.y && y < box.y + box.height && (x === box.x || x === box.x + box.width)) return { side: x === box.x ? 'left' : 'right', offset: y - box.y };
    return undefined;
}

function segmentsMeet([a, b], [c, d]) {
    const av = a[0] === b[0];
    const cv = c[0] === d[0];
    if (av === cv) {
        const axis = av ? 1 : 0;
        return a[1 - axis] === c[1 - axis] && Math.min(Math.max(a[axis], b[axis]), Math.max(c[axis], d[axis])) > Math.max(Math.min(a[axis], b[axis]), Math.min(c[axis], d[axis]));
    }
    const [v1, v2, h1, h2] = av ? [a, b, c, d] : [c, d, a, b];
    return v1[0] >= Math.min(h1[0], h2[0]) && v1[0] <= Math.max(h1[0], h2[0]) && h1[1] >= Math.min(v1[1], v2[1]) && h1[1] <= Math.max(v1[1], v2[1]);
}

function distanceToSegment(box, [a, b]) {
    const minX = Math.min(a[0], b[0]);
    const maxX = Math.max(a[0], b[0]);
    const minY = Math.min(a[1], b[1]);
    const maxY = Math.max(a[1], b[1]);
    return Math.hypot(Math.max(box.x - maxX, minX - box.x - box.width, 0), Math.max(box.y - maxY, minY - box.y - box.height, 0));
}

export function checkGeometry(diagram) {
    const { nodes, edges } = geometry(diagram.body);
    const ids = new Map(nodes.map((node) => [node.id, node]));
    assert.equal(ids.size, nodes.length, `${diagram.key}: duplicate node names`);
    assert.ok(nodes.length >= 2 && nodes.length <= 9, `${diagram.key}: ${nodes.length} nodes`);
    assert.ok(edges.length <= 12, `${diagram.key}: ${edges.length} edges`);
    assert.ok((diagram.body.match(/ data-focal=/g) ?? []).length <= 2, `${diagram.key}: too many focal nodes`);
    const attachments = new Map();
    for (const node of nodes) {
        for (const value of [node.x, node.y, node.width, node.height]) assert.equal(value % 4, 0, `${diagram.key}/${node.id}: off-grid geometry`);
        assert.ok(node.x >= 0 && node.y >= 0 && node.x + node.width <= diagram.width && node.y + node.height <= diagram.height, `${diagram.key}/${node.id}: outside canvas`);
        for (const other of nodes) if (node.id !== other.id) assert.ok(!intersects(node, other), `${diagram.key}: ${node.id} overlaps ${other.id}`);
    }
    for (const edge of edges) {
        for (let i = 1; i < edge.points.length; i++) {
            const [a, b] = [edge.points[i - 1], edge.points[i]];
            assert.notEqual(a[0] === b[0], a[1] === b[1], `${diagram.key}: non-orthogonal or empty route ${edge.from} → ${edge.to}`);
            for (const box of nodes.filter((node) => ![edge.from, edge.to].includes(node.id)))
                assert.ok(!segmentCrossesNode(a, b, box), `${diagram.key}: ${edge.from} → ${edge.to} crosses ${box.id}`);
        }
        if (!edge.from && !edge.to) continue;
        for (const [id, point, neighbor] of [
            [edge.from, edge.points[0], edge.points[1]],
            [edge.to, edge.points.at(-1), edge.points.at(-2)],
        ]) {
            const box = ids.get(id);
            assert.ok(box, `${diagram.key}: edge names missing node ${id}`);
            const attachment = port(point, box);
            assert.ok(attachment, `${diagram.key}: ${id} route does not attach to its border: ${point}`);
            const vertical = attachment.side === 'top' || attachment.side === 'bottom';
            assert.ok(vertical ? point[0] === neighbor[0] : point[1] === neighbor[1], `${diagram.key}/${id}: connector rides its border`);
            const length = vertical ? box.width : box.height;
            assert.ok(attachment.offset >= 8 && length - attachment.offset >= 8, `${diagram.key}/${id}: corner port`);
            const key = `${id}/${attachment.side}`;
            const offsets = attachments.get(key) ?? [];
            for (const offset of offsets) assert.ok(Math.abs(offset - attachment.offset) >= 12, `${diagram.key}/${key}: connectors share a port`);
            offsets.push(attachment.offset);
            attachments.set(key, offsets);
        }
    }
    for (let i = 0; i < edges.length; i++)
        for (let j = i + 1; j < edges.length; j++) {
            const a = edges[i];
            const b = edges[j];
            for (let k = 1; k < a.points.length; k++)
                for (let m = 1; m < b.points.length; m++)
                    assert.ok(
                        !segmentsMeet([a.points[k - 1], a.points[k]], [b.points[m - 1], b.points[m]]),
                        `${diagram.key}: overlapping/crossing routes ${a.from} → ${a.to}, ${b.from} → ${b.to}`,
                    );
        }
    const firstNode = diagram.body.indexOf('<g data-node=');
    const lastEdge = diagram.body.lastIndexOf('<path class="go-edge');
    assert.ok(lastEdge < firstNode, `${diagram.key}: connector painted after nodes`);
    for (const match of diagram.body.matchAll(/data-label-box="([^"]+)"/g)) {
        const [x, y, width, height] = match[1].split(' ').map(Number);
        const box = { x, y, width, height };
        for (const node of nodes) assert.ok(!intersects(box, node), `${diagram.key}: label mask overlaps ${node.id}`);
        const gap = Math.min(...edges.flatMap((edge) => edge.points.slice(1).map((point, index) => distanceToSegment(box, [edge.points[index], point]))));
        assert.ok(gap >= 6 && gap <= 10, `${diagram.key}: label gap is ${gap}px`);
    }
    return { nodes, edges };
}
