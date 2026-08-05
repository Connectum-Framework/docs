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
    setupMermaidZoom()
    document.addEventListener('click', onTabClick)
    window.addEventListener('storage', onStorage)
})

onBeforeUnmount(() => {
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
