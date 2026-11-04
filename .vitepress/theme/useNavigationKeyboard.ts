import { onBeforeUnmount, onMounted } from 'vue';

export function useNavigationKeyboard() {
    function dismiss(event: KeyboardEvent) {
        if (event.key !== 'Escape' || !(event.target instanceof Element)) return;
        const group = event.target.closest('.VPNavBarMenuGroup');
        const trigger = group?.querySelector<HTMLButtonElement>(':scope > button[aria-expanded="true"]');
        if (!trigger) return;
        event.preventDefault();
        trigger.click();
        trigger.focus();
    }

    onMounted(() => document.addEventListener('keydown', dismiss));
    onBeforeUnmount(() => document.removeEventListener('keydown', dismiss));
}
