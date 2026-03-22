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
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';

const BreakoutGame = defineAsyncComponent(() => import('./BreakoutGame.vue'));

const buffer = ref<string[]>([]);
const active = ref(false);

function handleKeydown(e: KeyboardEvent) {
  if (active.value) return;
  buffer.value = [...buffer.value, e.key].slice(-KONAMI_SEQUENCE.length);
  if (isKonamiComplete(buffer.value)) {
    active.value = true;
    buffer.value = [];
  }
}

function dismiss() {
  active.value = false;
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <slot />
  <Teleport to="body">
    <BreakoutGame v-if="active" @dismiss="dismiss" />
  </Teleport>
</template>
