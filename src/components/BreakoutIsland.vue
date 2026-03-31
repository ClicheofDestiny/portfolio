<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';

const BreakoutGame = defineAsyncComponent(() => import('./BreakoutGame.vue'));

const active = ref(false);

function onKonami() { active.value = true; }
function dismiss() { active.value = false; }

onMounted(() => window.addEventListener('konami', onKonami));
onUnmounted(() => window.removeEventListener('konami', onKonami));
</script>

<template>
  <BreakoutGame v-if="active" @dismiss="dismiss" />
</template>
