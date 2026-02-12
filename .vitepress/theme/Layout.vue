<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'

const route = useRoute()

// --- Medium Zoom for images ---
let zoom: ReturnType<typeof mediumZoom>

const initImageZoom = () => {
    if (!zoom) {
        zoom = mediumZoom({ background: 'var(--vp-c-bg)' })
    }
    zoom.detach()
    nextTick(() => {
        zoom.attach('.vp-doc img:not(.no-zoom)')
    })
}

// --- Fullscreen overlay for mermaid diagrams ---
const openOverlay = (container: HTMLElement) => {
    const svgEl = container.querySelector('svg')
    if (!svgEl) return

    const overlay = document.createElement('div')
    overlay.className = 'mermaid-zoom-overlay'

    const clone = svgEl.cloneNode(true) as SVGElement
    clone.removeAttribute('width')
    clone.style.maxWidth = '95vw'
    clone.style.maxHeight = '90vh'
    clone.style.height = 'auto'

    overlay.appendChild(clone)

    const close = () => {
        overlay.remove()
        document.removeEventListener('keydown', onKey)
    }

    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close()
    }

    overlay.addEventListener('click', close)
    document.addEventListener('keydown', onKey)
    document.body.appendChild(overlay)
}

const setupMermaidZoom = () => {
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.mermaid:not([data-zoom])').forEach((el) => {
            if (!el.querySelector('svg')) return
            el.setAttribute('data-zoom', '')
            ;(el as HTMLElement).style.cursor = 'zoom-in'
            el.addEventListener('click', () => openOverlay(el as HTMLElement))
        })
    })

    observer.observe(document.body, { childList: true, subtree: true })
}

onMounted(() => {
    initImageZoom()
    setupMermaidZoom()
})

watch(() => route.path, () => nextTick(initImageZoom))
</script>

<template>
    <DefaultTheme.Layout />
</template>
