<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import RuntimeSwitch from './RuntimeSwitch.vue'
import { isRuntime, RUNTIME_STORAGE_KEY, setRuntime } from './runtime.ts'

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

// --- Runtime switcher (Node.js | Bun) ---
// The in-page tabs rendered by the `::: runtime` markdown container are static HTML,
// so they are handled by one delegated listener instead of a component per block.
const onRuntimeTabClick = (event: MouseEvent) => {
    const tab = (event.target as HTMLElement | null)?.closest<HTMLElement>('.runtime-tab')
    const value = tab?.dataset.runtimeValue
    if (!isRuntime(value)) return

    // Keep the clicked block where it is: panels differ in height, so switching would
    // otherwise scroll the surrounding text out from under the reader.
    const group = tab!.closest<HTMLElement>('.runtime-group')
    const before = group?.getBoundingClientRect().top
    setRuntime(value)
    if (group && before !== undefined) {
        const delta = group.getBoundingClientRect().top - before
        if (delta) window.scrollBy({ top: delta, behavior: 'instant' as ScrollBehavior })
    }
}

// Another tab of the same site changed the runtime -- follow it without writing back.
const onStorage = (event: StorageEvent) => {
    if (event.key !== RUNTIME_STORAGE_KEY || !isRuntime(event.newValue)) return
    document.documentElement.dataset.runtime = event.newValue
}

onMounted(() => {
    initImageZoom()
    setupMermaidZoom()
    document.addEventListener('click', onRuntimeTabClick)
    window.addEventListener('storage', onStorage)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', onRuntimeTabClick)
    window.removeEventListener('storage', onStorage)
})

watch(() => route.path, () => nextTick(initImageZoom))
</script>

<template>
    <DefaultTheme.Layout>
        <template #nav-bar-content-after>
            <RuntimeSwitch />
        </template>
        <template #nav-screen-content-after>
            <RuntimeSwitch screen />
        </template>
    </DefaultTheme.Layout>
</template>
