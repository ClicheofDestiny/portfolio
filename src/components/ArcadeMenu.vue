<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { siteConfig } from '../config/site';

const selectedIndex = ref(0);

function move(dir: 1 | -1) {
  const len = siteConfig.nav.length;
  selectedIndex.value = (selectedIndex.value + dir + len) % len;
}

function navigate(href: string) {
  window.location.href = href;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); move(-1); }
  if (e.key === 'Enter') { navigate(siteConfig.nav[selectedIndex.value].href); }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <nav aria-label="Main menu" @keydown="handleKeydown">
    <div class="menu-title text-xxs label glow-violet">— SELECT MODE —</div>
    <ul role="menu" class="menu-list">
      <li
        v-for="(item, i) in siteConfig.nav"
        :key="item.href"
        role="menuitem"
        :aria-current="i === selectedIndex ? 'true' : undefined"
        class="menu-item text-xs"
        :class="{ active: i === selectedIndex }"
        @click="() => navigate(item.href)"
        @mouseenter="selectedIndex = i"
        tabindex="0"
      >
        <span class="cursor" aria-hidden="true">{{ i === selectedIndex ? '▶' : '\u00A0' }}</span>
        <span class="key glow-violet">[{{ item.key }}]</span>
        <span class="item-label">{{ item.label }}</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.menu-title { color: var(--gold); margin-bottom: 14px; display: block; }
.menu-list { list-style: none; }
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  color: var(--dim);
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 3px;
  transition: color 0.1s;
  outline: none;
}
.menu-item.active {
  background: rgba(47, 255, 255, 0.06);
  color: var(--cyan);
  text-shadow: 0 0 8px var(--cyan);
  border: 1px solid rgba(47, 255, 255, 0.15);
}
.menu-item:not(.active) { border: 1px solid transparent; }
.cursor { color: var(--pink); width: 12px; display: inline-block; }
.key { font-size: 7px; }
.item-label { flex: 1; }
</style>
