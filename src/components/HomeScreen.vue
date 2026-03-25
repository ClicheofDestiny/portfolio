<script setup lang="ts">
import { ref } from 'vue';
import AttractMode from './AttractMode.vue';
import ArcadeMenu from './ArcadeMenu.vue';

// Show menu directly only if the user already pressed start this session
// (e.g. they navigated to a project and came back).
const showMenu = ref(
  typeof window !== 'undefined' && sessionStorage.getItem('started') === '1'
);

function onStart() {
  if (typeof window !== 'undefined') sessionStorage.setItem('started', '1');
  showMenu.value = true;
}
</script>

<template>
  <ArcadeMenu v-if="showMenu" />
  <AttractMode v-else @start="onStart" />
</template>
