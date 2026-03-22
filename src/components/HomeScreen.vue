<script setup lang="ts">
import { ref } from 'vue';
import AttractMode from './AttractMode.vue';
import ArcadeMenu from './ArcadeMenu.vue';

// If browser history has entries, assume the user navigated back — show menu.
// Note: history.length > 1 is a heuristic; it may be true on a fresh tab if
// the browser had prior history. Good enough for a portfolio site.
const showMenu = ref(
  typeof window !== 'undefined' && window.history.length > 1
);
</script>

<template>
  <ArcadeMenu v-if="showMenu" />
  <AttractMode v-else @start="showMenu = true" />
</template>
