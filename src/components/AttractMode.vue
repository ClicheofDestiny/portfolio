<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { siteConfig } from '../config/site';

const emit = defineEmits<{ start: [] }>();

function handleStart() {
  emit('start');
}

function handleKeydown() {
  window.removeEventListener('keydown', handleKeydown);
  emit('start');
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown, { once: true });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="attract" @click="handleStart" @keydown="handleKeydown" tabindex="0" role="button" aria-label="Press any key to start">
    <div class="title-line1 text-xxl glow-cyan">{{ siteConfig.name.split(' ')[0].toUpperCase() }}</div>
    <div class="title-line2 text-lg glow-violet">{{ siteConfig.name.split(' ')[1].toUpperCase() }}</div>
    <div class="tagline text-xxs label glow-pink">★ {{ siteConfig.tagline.toUpperCase() }} ★</div>

    <div class="high-scores">
      <div class="scores-label text-xxs label">— HIGH SCORES —</div>
      <div
        v-for="entry in siteConfig.highScores"
        :key="entry.rank"
        class="score-row text-xs"
      >
        <span class="rank glow-pink">{{ entry.rank }}</span>
        <span class="score-label">{{ entry.label }}</span>
        <span class="score-val glow-gold">{{ entry.value }}</span>
      </div>
    </div>

    <div class="press-start text-xs blink">▶ PRESS START ◀</div>
  </div>
</template>

<style scoped>
.attract {
  text-align: center;
  padding: 12px 0;
  cursor: pointer;
  outline: none;
}
.title-line1 { margin-bottom: 4px; }
.title-line2 { margin-bottom: 8px; }
.tagline { margin-bottom: 20px; }
.high-scores {
  background: rgba(47, 255, 255, 0.04);
  border: 1px solid rgba(47, 255, 255, 0.15);
  border-radius: 4px;
  padding: 12px;
  margin: 0 auto 20px;
  max-width: 320px;
}
.scores-label { color: var(--cyan); margin-bottom: 10px; display: block; }
.score-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.rank { color: var(--pink); }
.score-label { color: var(--white); opacity: 0.8; }
.score-val { color: var(--gold); }
.press-start { color: var(--white); opacity: 0.8; }
</style>
