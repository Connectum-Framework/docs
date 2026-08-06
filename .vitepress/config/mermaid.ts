import type { MermaidConfig } from 'mermaid';

/**
 * The single Connectum presentation system for Mermaid diagrams.
 *
 * Mermaid has two styling phases and they are not interchangeable:
 *
 *  - render-time configuration (font, padding, spacing, wrapping) participates in
 *    text measurement, so a node is sized for the metrics set here;
 *  - `themeCSS` is embedded in the generated SVG and only paints what the layout
 *    already decided.
 *
 * Enlarging diagram text from `custom.css` therefore clips labels: the geometry was
 * already computed for the old metrics. Anything that changes size belongs above the
 * `themeCSS` string; anything that changes color belongs inside it.
 *
 * Colors resolve through `--connectum-diagram-*`, declared once per theme in
 * `theme/custom.css`. That indirection is what makes the diagrams follow the reader's
 * light/dark choice: `vitepress-plugin-mermaid` re-renders with `theme: 'dark'` when the
 * `dark` class appears on <html>, and mermaid appends `themeCSS` *after* its own theme
 * rules, so these declarations win in both modes without a second palette here. It also
 * survives the fullscreen clone in `theme/Layout.vue`, because the stylesheet is part of
 * the SVG being cloned rather than a document rule scoped to `.mermaid`.
 */

/** Matches the authored technical SVGs and the VitePress body font. */
const DIAGRAM_FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

/**
 * Diagram-internal presentation.
 *
 * Selectors are grouped by the three families the portal actually uses -- flowchart and
 * graph, sequence, and state. Mermaid's built-in dark theme emits a color for every
 * selector it knows, so a primitive that is *not* listed here silently keeps that color;
 * the list is therefore exhaustive per family rather than minimal.
 *
 * Every selector below was checked against the rendered corpus, and the ones that could
 * never match anything -- legacy dagre-d3 names, the text-label variants that HTML
 * labels replace, class-diagram markers -- were removed rather than left as decoration.
 * What remains but is not yet exercised by any page is deliberate: the semantic variants
 * are declared for all five roles across all node shapes, and the sequence primitives
 * cover activations, notes, loops and autonumbering, so the first author to use one gets
 * the theme instead of mermaid's default.
 */
const themeCSS = `
    /* ---------- Shared: text and lines ----------

       Label typography has to be pinned here rather than in the page stylesheet, and the
       reason is structural: mermaid measures an HTML label inside a throwaway container
       under <body>, then the finished SVG string is injected into \`.vp-doc\`. Any document
       rule that reaches the label -- \`.vp-doc p\` sets \`line-height: 28px\` -- applies only
       at paint, so every line grows past the height the node was sized for and a
       two-line label leaves its box. Declared in \`themeCSS\` the value is identical in
       both places, and the \`#<svg-id>\` mermaid prefixes it with outranks \`.vp-doc\`. */

    foreignObject div,
    foreignObject span,
    foreignObject p {
        line-height: 1.5;
        margin: 0;
        padding: 0;
    }

    .label,
    .nodeLabel,
    .nodeLabel p,
    .label span {
        color: var(--connectum-diagram-text);
        fill: var(--connectum-diagram-text);
        font-weight: 500;
    }

    .marker,
    .marker.cross,
    [id$="-pointEnd"],
    [id$="-pointStart"],
    [id$="-circleEnd"],
    [id$="-circleStart"],
    [id$="-crossEnd"],
    [id$="-crossStart"],
    [id$="-barbEnd"] {
        fill: var(--connectum-diagram-line);
        stroke: var(--connectum-diagram-line);
    }

    /* ---------- Flowchart and graph ---------- */

    .node rect,
    .node circle,
    .node ellipse,
    .node polygon,
    .node path {
        fill: var(--connectum-diagram-node);
        stroke: var(--connectum-diagram-border-strong);
        stroke-width: 1.5px;
    }

    /* Rectangles pick up the radius of the authored figures. Stadiums, circles and
       decision diamonds are paths and polygons, so their silhouettes are untouched. */
    .node rect {
        rx: 10px;
        ry: 10px;
    }

    .cluster rect {
        fill: var(--connectum-diagram-surface);
        stroke: var(--connectum-diagram-border);
        stroke-width: 1.5px;
        rx: 14px;
        ry: 14px;
    }

    .cluster-label span,
    .cluster-label span p,
    .cluster span {
        color: var(--connectum-diagram-muted);
        fill: var(--connectum-diagram-muted);
        font-weight: 650;
    }

    .flowchart-link,
    .transition {
        stroke: var(--connectum-diagram-line);
        stroke-width: 1.75px;
        fill: none;
    }

    /* An edge label sits on top of its line, so it needs an opaque plate of the page
       colour rather than mermaid's translucent default, which lets the line show
       through the text. */
    .edgeLabel,
    .edgeLabel p,
    .edgeLabel .labelBkg,
    .edgeLabel foreignObject div,
    .labelBkg,
    .label div .edgeLabel {
        background-color: var(--connectum-diagram-node);
        fill: var(--connectum-diagram-muted);
        color: var(--connectum-diagram-muted);
    }

    /* ---------- Semantic variants ----------
       Applied with \`:::accent\` / \`class Node accent\`. Colour is the secondary signal;
       the node text still has to say what the node is. */

    .node.accent rect,
    .node.accent circle,
    .node.accent ellipse,
    .node.accent polygon,
    .node.accent path {
        fill: var(--connectum-diagram-surface-accent);
        stroke: var(--connectum-diagram-accent);
    }

    .node.positive rect,
    .node.positive circle,
    .node.positive ellipse,
    .node.positive polygon,
    .node.positive path {
        fill: var(--connectum-diagram-positive-surface);
        stroke: var(--connectum-diagram-positive);
    }

    .node.warning rect,
    .node.warning circle,
    .node.warning ellipse,
    .node.warning polygon,
    .node.warning path {
        fill: var(--connectum-diagram-warning-surface);
        stroke: var(--connectum-diagram-warning);
    }

    .node.critical rect,
    .node.critical circle,
    .node.critical ellipse,
    .node.critical polygon,
    .node.critical path {
        fill: var(--connectum-diagram-critical-surface);
        stroke: var(--connectum-diagram-critical);
    }

    .node.muted rect,
    .node.muted circle,
    .node.muted ellipse,
    .node.muted polygon,
    .node.muted path {
        fill: var(--connectum-diagram-muted-surface);
        stroke: var(--connectum-diagram-border);
    }

    .node.muted .nodeLabel,
    .node.muted .nodeLabel p {
        color: var(--connectum-diagram-muted);
        fill: var(--connectum-diagram-muted);
    }

    .cluster.accent rect {
        fill: var(--connectum-diagram-surface-accent);
        stroke: var(--connectum-diagram-accent);
    }

    /* ---------- Sequence ---------- */

    .actor {
        fill: var(--connectum-diagram-node);
        stroke: var(--connectum-diagram-border-strong);
        stroke-width: 1.5px;
    }

    text.actor,
    text.actor > tspan {
        fill: var(--connectum-diagram-text);
        stroke: none;
        font-weight: 600;
    }

    .actor-line {
        stroke: var(--connectum-diagram-border);
        stroke-width: 1.5px;
        fill: none;
    }

    .actor-man circle,
    .actor-man line {
        fill: var(--connectum-diagram-node);
        stroke: var(--connectum-diagram-border-strong);
    }

    .messageLine0,
    .messageLine1 {
        stroke: var(--connectum-diagram-line);
        stroke-width: 1.75px;
    }

    .messageText {
        fill: var(--connectum-diagram-text);
        stroke: none;
    }

    [id$="-arrowhead"] path,
    [id$="-crosshead"] path,
    [id$="-filled-head"] path,
    [id$="-sequencenumber"] {
        fill: var(--connectum-diagram-line);
        stroke: var(--connectum-diagram-line);
    }

    .sequenceNumber {
        fill: var(--connectum-diagram-node);
    }

    .activation0,
    .activation1,
    .activation2 {
        fill: var(--connectum-diagram-surface-accent);
        stroke: var(--connectum-diagram-accent);
    }

    .labelBox {
        fill: var(--connectum-diagram-surface);
        stroke: var(--connectum-diagram-border-strong);
    }

    .labelText,
    .labelText > tspan,
    .loopText,
    .loopText > tspan,
    .sectionTitle,
    .sectionTitle > tspan {
        fill: var(--connectum-diagram-text);
        stroke: none;
    }

    .loopLine {
        stroke: var(--connectum-diagram-border-strong);
        fill: var(--connectum-diagram-border-strong);
    }

    .note,
    rect.note,
    .statediagram-note rect {
        fill: var(--connectum-diagram-surface-accent);
        stroke: var(--connectum-diagram-accent);
    }

    .noteText,
    .noteText > tspan,
    .statediagram-note .nodeLabel {
        fill: var(--connectum-diagram-text);
        color: var(--connectum-diagram-text);
        stroke: none;
    }

    /* ---------- State ---------- */

    /* Two things about state selectors, learned by reading the emitted markup rather
       than mermaid's stylesheet, and worth knowing before extending this block.

       First, \`statediagram\` is a class on the <svg> root, and mermaid prefixes every
       rule here with that same element's id -- so a \`.statediagram <descendant>\`
       selector can never match. (Which is also why mermaid's own
       \`.statediagram .edgeLabel { color: red }\` never takes effect.) Primitives have to
       be reached through their own classes.

       Second, mermaid 11 renders \`stateDiagram\` and \`stateDiagram-v2\` through the same
       unified renderer, and it emits none of the classic state class names --
       \`stateLabel\`, \`title-state\`, \`state-end\`, \`end-state-inner\`, \`end-state-outer\`,
       \`fork-join\`, \`divider\`. Styling them would be styling nothing. States arrive as
       ordinary \`.node\` shapes and are already covered above. */

    /* The initial marker is a filled disc, which is what separates it from an ordinary
       state at a glance. */
    .node circle.state-start {
        fill: var(--connectum-diagram-text);
        stroke: var(--connectum-diagram-text);
    }

    /* The terminal marker is a ring around a solid disc, and mermaid emits both as
       unclassed roughjs paths -- the disc is only reachable through the nested group
       inside \`.outer-path\`. Without this it inherits the plain node fill and the marker
       degrades into two empty rings. No other shape nests a group there. */
    .node > .outer-path > g path {
        fill: var(--connectum-diagram-text);
        stroke: var(--connectum-diagram-text);
    }

    .statediagram-cluster rect {
        fill: var(--connectum-diagram-surface);
        stroke: var(--connectum-diagram-border);
    }

    .statediagram-cluster.statediagram-cluster .inner,
    .statediagram-cluster.statediagram-cluster-alt .inner {
        fill: var(--connectum-diagram-node);
    }
`;

export const mermaidConfig: MermaidConfig = {
    fontFamily: DIAGRAM_FONT,
    fontSize: 15,
    /* Mermaid's default today, pinned because the theme depends on it: with HTML labels
       every piece of diagram text is a `<span>`/`<p>` inside a `foreignObject`, and that
       is what the selectors above style. Turning it off would swap the whole label layer
       for `text`/`tspan` elements and silently drop the text coverage. */
    htmlLabels: true,
    themeCSS,
    themeVariables: {
        fontFamily: DIAGRAM_FONT,
        fontSize: '15px',
    },
    flowchart: {
        /* Angular routing reads as a wiring diagram and keeps a line's rank visible;
           mermaid's default `basis` curve bows edges into neighbouring nodes. */
        curve: 'linear',
        /* `padding` is the gap between a label and its own shape; the two spacings are
           between nodes. Together they are what stops arrowheads from landing on a
           border and labels from touching one.
           Rank spacing is kept close to mermaid's default on purpose: it runs along the
           flow axis, so on a horizontal chart every extra pixel widens the diagram and
           `useMaxWidth` pays for it by scaling the whole thing -- and the text with it --
           further down inside the documentation column. */
        padding: 14,
        nodeSpacing: 52,
        rankSpacing: 56,
        diagramPadding: 12,
        wrappingWidth: 220,
        subGraphTitleMargin: { top: 6, bottom: 10 },
        useMaxWidth: true,
    },
    sequence: {
        actorMargin: 64,
        messageMargin: 44,
        boxMargin: 12,
        boxTextMargin: 6,
        noteMargin: 12,
        diagramMarginX: 24,
        diagramMarginY: 16,
        useMaxWidth: true,
    },
    state: {
        nodeSpacing: 52,
        rankSpacing: 56,
        padding: 14,
        useMaxWidth: true,
    },
};
