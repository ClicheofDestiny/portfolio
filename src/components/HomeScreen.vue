<script setup lang="ts">
import { ref } from 'vue';
import AttractMode from './AttractMode.vue';
import ArcadeMenu from './ArcadeMenu.vue';

// Skip attract mode only when the user arrived from within this site
// (back/forward navigation or an internal link). Fresh visits and
// refreshes always show attract mode.
function cameFromWithinSite(): boolean {
  if (typeof window === 'undefined') return false;
  const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type;
  if (navType === 'back_forward') return true;
  try {
    return !!document.referrer && new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}

const showMenu = ref(cameFromWithinSite());

function onStart() {
  showMenu.value = true;
}
</script>

<template>
  <ArcadeMenu v-if="showMenu" />
  <AttractMode v-else @start="onStart" />
</template>
