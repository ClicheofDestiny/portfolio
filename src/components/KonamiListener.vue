<script lang="ts">
export const KONAMI_SEQUENCE = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];

export function isKonamiComplete(buffer: string[]): boolean {
  if (buffer.length !== KONAMI_SEQUENCE.length) return false;
  return buffer.every((key, i) => key === KONAMI_SEQUENCE[i]);
}
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const buffer = ref<string[]>([]);

function pushKey(key: string) {
  buffer.value = [...buffer.value, key].slice(-KONAMI_SEQUENCE.length);
  if (isKonamiComplete(buffer.value)) {
    window.dispatchEvent(new CustomEvent('konami'));
    buffer.value = [];
  }
}

function handleKeydown(e: KeyboardEvent) { pushKey(e.key); }
function handleCabinetInput(e: Event) { pushKey((e as CustomEvent<{ key: string }>).detail.key); }

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('cabinet-input', handleCabinetInput);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('cabinet-input', handleCabinetInput);
});
</script>

<template>
  <slot />
</template>
