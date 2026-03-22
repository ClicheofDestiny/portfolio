<script setup lang="ts">
import { ref } from 'vue';
import AttractMode from './AttractMode.vue';
import ArcadeMenu from './ArcadeMenu.vue';

// If navigating back to home, always show menu (not attract)
const showMenu = ref(
  typeof window !== 'undefined' && window.history.length > 1
);
</script>

<template>
  <ArcadeMenu v-if="showMenu" />
  <AttractMode v-else @start="showMenu = true" />
</template>
