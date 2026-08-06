<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import { isPackageManager, PACKAGE_MANAGER_STORAGE_KEY, setPackageManager } from './packageManager.ts'
import { isRuntime, RUNTIME_STORAGE_KEY, setRuntime } from './runtime.ts'
import PageContext from './components/PageContext.vue'

const route = useRoute()

// --- Medium Zoom for images ---
let zoom: ReturnType<typeof mediumZoom>
let diagramObserver: MutationObserver | undefined

const initImageZoom = () => {
    if (!zoom) {
        zoom = mediumZoom({ background: 'var(--vp-c-bg)' })
    }
    zoom.detach()
    nextTick(() => {
        zoom.attach('.vp-doc img:not(.no-zoom)')
    })
}

// --- Fullscreen overlay for Mermaid and project-authored SVG diagrams ---
const openOverlay = (container: HTMLElement) => {
    const svgEl = container.querySelector('svg')
    if (!svgEl) return

    const previousFocus = document.activeElement as HTMLElement | null
    const overlay = document.createElement('div')
    overlay.className = 'mermaid-zoom-overlay'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')
    overlay.setAttribute('aria-label', 'Expanded diagram')
    overlay.tabIndex = -1

    const clone = svgEl.cloneNode(true) as SVGElement
    clone.removeAttribute('width')
    clone.removeAttribute('height')
    clone.style.width = '95vw'
    clone.style.height = '90vh'
    clone.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    const closeButton = document.createElement('button')
    closeButton.className = 'mermaid-zoom-overlay__close'
    closeButton.type = 'button'
    closeButton.textContent = 'Close diagram'

    const close = () => {
        overlay.remove()
        document.removeEventListener('keydown', onKey)
        previousFocus?.focus()
    }

    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close()
    }

    closeButton.addEventListener('click', close)
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) close()
    })
    document.addEventListener('keydown', onKey)
    overlay.append(clone, closeButton)
    document.body.appendChild(overlay)
    overlay.focus()
}

const setupDiagramZoom = () => {
    const enhanceDiagrams = () => {
        document.querySelectorAll('.mermaid:not([data-zoom]), .technical-diagram__art:not([data-zoom])').forEach((el) => {
            if (!el.querySelector('svg')) return
            el.setAttribute('data-zoom', '')
            el.setAttribute('role', 'button')
            el.setAttribute('aria-label', 'Open diagram in fullscreen')
            ;(el as HTMLElement).tabIndex = 0
            el.addEventListener('click', () => openOverlay(el as HTMLElement))
            el.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                openOverlay(el as HTMLElement)
            })
        })
    }

    enhanceDiagrams()
    diagramObserver = new MutationObserver(enhanceDiagrams)
    diagramObserver.observe(document.body, { childList: true, subtree: true })
}

// --- Variant switchers (runtime, package manager) ---
// The in-page tabs rendered by the `::: runtime` and `::: pm` markdown containers are
// static HTML, so one delegated listener handles both instead of a component per block.
const AXES = [
    { selector: '.runtime-tab', group: '.runtime-group', read: (el: HTMLElement) => el.dataset.runtimeValue, apply: setRuntime, isValid: isRuntime },
    { selector: '.pm-tab', group: '.pm-group', read: (el: HTMLElement) => el.dataset.pmValue, apply: setPackageManager, isValid: isPackageManager },
] as const

const onTabClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null
    if (!target) return

    for (const axis of AXES) {
        const tab = target.closest<HTMLElement>(axis.selector)
        if (!tab) continue
        const value = axis.read(tab)
        if (!axis.isValid(value)) return

        // Keep the clicked block where it is: panels differ in height, so switching
        // would otherwise scroll the surrounding text out from under the reader.
        const group = tab.closest<HTMLElement>(axis.group)
        const before = group?.getBoundingClientRect().top
        ;(axis.apply as (v: string) => void)(value)
        if (group && before !== undefined) {
            const delta = group.getBoundingClientRect().top - before
            if (delta) window.scrollBy({ top: delta, behavior: 'instant' as ScrollBehavior })
        }
        return
    }
}

// Another browser tab changed a selection -- follow it without writing back.
const onStorage = (event: StorageEvent) => {
    if (event.key === RUNTIME_STORAGE_KEY && isRuntime(event.newValue)) {
        document.documentElement.dataset.runtime = event.newValue
    } else if (event.key === PACKAGE_MANAGER_STORAGE_KEY && isPackageManager(event.newValue)) {
        document.documentElement.dataset.pm = event.newValue
    }
}

onMounted(() => {
    initImageZoom()
    setupDiagramZoom()
    document.addEventListener('click', onTabClick)
    window.addEventListener('storage', onStorage)
})

onBeforeUnmount(() => {
    diagramObserver?.disconnect()
    document.removeEventListener('click', onTabClick)
    window.removeEventListener('storage', onStorage)
})

watch(() => route.path, () => nextTick(initImageZoom))
</script>

<template>
    <DefaultTheme.Layout>
        <template #doc-before>
            <PageContext />
        </template>
    </DefaultTheme.Layout>
</template>
