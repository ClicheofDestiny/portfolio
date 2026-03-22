<script setup lang="ts">
export interface Stage {
  slug: string;
  title: string;
  stage: number;
  published: boolean;
  xp: number;
  category: string;
  date: string; // pre-formatted ISO date string (YYYY-MM-DD)
}

defineProps<{ stages: Stage[] }>();
</script>

<template>
  <div class="level-select">
    <h1 class="page-title text-md glow-cyan">LEVEL SELECT</h1>

    <ul class="stage-list">
      <li
        v-for="s in stages"
        :key="s.slug"
        :data-stage="s.stage"
        class="stage-item"
        :class="{ locked: !s.published }"
        :aria-disabled="!s.published ? 'true' : undefined"
        :aria-label="s.published ? undefined : `Stage ${String(s.stage).padStart(2, '0')}: Locked`"
      >
        <template v-if="s.published">
          <a :href="`/writing/${s.slug}`" class="stage-link">
            <span class="stage-xp text-xxs glow-gold">+{{ s.xp }} XP</span>
            <div class="stage-title text-xs">{{ s.title }}</div>
            <div class="stage-meta text-xxs">
              STAGE {{ String(s.stage).padStart(2, '0') }} · {{ s.date }} · <span class="stage-category">{{ s.category }}</span>
            </div>
          </a>
        </template>
        <template v-else>
          <span class="stage-xp text-xxs locked-xp">LOCKED</span>
          <div class="stage-title text-xs locked-title">???</div>
          <div class="stage-meta text-xxs">STAGE {{ String(s.stage).padStart(2, '0') }} · ???</div>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page-title { margin-bottom: 16px; }
.stage-list { list-style: none; }
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
.stage-title { color: var(--white); margin-bottom: 4px; padding-right: 60px; text-transform: uppercase; }
.locked-title { color: var(--dim); }
.stage-meta { color: var(--dim); }
.stage-category { text-transform: uppercase; }
</style>
