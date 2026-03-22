<script setup lang="ts">
interface Stage {
  slug: string;
  title: string;
  stage: number;
  published: boolean;
  xp: number;
  category: string;
  date: string;
}

defineProps<{ stages: Stage[] }>();
</script>

<template>
  <div class="level-select">
    <h1 class="page-title text-md glow-cyan">LEVEL SELECT</h1>

    <div
      v-for="s in stages"
      :key="s.slug"
      :data-stage="s.stage"
      class="stage-item"
      :class="{ locked: !s.published }"
    >
      <template v-if="s.published">
        <a :href="`/writing/${s.slug}`" class="stage-link">
          <span class="stage-xp text-xxs glow-gold">+{{ s.xp }} XP</span>
          <div class="stage-title text-xs">{{ s.title.toUpperCase() }}</div>
          <div class="stage-meta text-xxs">
            STAGE {{ String(s.stage).padStart(2, '0') }} · {{ s.date }} · {{ s.category.toUpperCase() }}
          </div>
        </a>
      </template>
      <template v-else>
        <span class="stage-xp text-xxs locked-xp">LOCKED</span>
        <div class="stage-title text-xs locked-title">???</div>
        <div class="stage-meta text-xxs">STAGE {{ String(s.stage).padStart(2, '0') }} · ???</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.page-title { margin-bottom: 16px; }
.stage-item {
  border: 1px solid rgba(47,255,255,0.15);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(47,255,255,0.02);
  position: relative;
}
.stage-item.locked { opacity: 0.35; }
.stage-link { display: block; text-decoration: none; color: inherit; }
.stage-link:hover .stage-title { color: var(--cyan); text-shadow: 0 0 8px var(--cyan); }
.stage-xp { position: absolute; top: 12px; right: 12px; color: var(--gold); }
.locked-xp { color: var(--dim); }
.stage-title { color: var(--white); margin-bottom: 4px; padding-right: 60px; }
.locked-title { color: var(--dim); }
.stage-meta { color: var(--dim); }
</style>
