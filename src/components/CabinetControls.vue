<script setup lang="ts">
function press(key: string) {
  window.dispatchEvent(new CustomEvent('cabinet-input', { detail: { key } }));
}
</script>

<template>
  <div class="controls">
    <div class="d-pad" role="group" aria-label="Directional pad">
      <div></div>
      <button class="d-btn" aria-label="Up"    @click="press('ArrowUp')">▲</button>
      <div></div>
      <button class="d-btn" aria-label="Left"  @click="press('ArrowLeft')">◀</button>
      <button class="d-btn center">●</button>
      <button class="d-btn" aria-label="Right" @click="press('ArrowRight')">▶</button>
      <div></div>
      <button class="d-btn" aria-label="Down"  @click="press('ArrowDown')">▼</button>
      <div></div>
    </div>
    <div class="label-area">PLAYER 1</div>
    <div class="action-buttons">
      <div class="btn-row">
        <button class="action-btn btn-cyan"   aria-label="A" @click="press('a')">A</button>
        <button class="action-btn btn-pink"   aria-label="B" @click="press('b')">B</button>
      </div>
      <div class="btn-row">
        <button class="action-btn btn-gold"   aria-label="C">C</button>
        <button class="action-btn btn-violet" aria-label="D">D</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--cabinet);
}
.d-pad {
  display: grid;
  grid-template-columns: repeat(3, 18px);
  grid-template-rows: repeat(3, 18px);
  gap: 2px;
}
.d-btn {
  background: var(--chrome);
  border: 1px solid var(--border);
  border-radius: 2px;
  display: flex; align-items: center; justify-content: center;
  font-size: 7px; color: var(--dim);
  cursor: pointer;
  padding: 0;
  transition: all 60ms;
}
.d-btn.center {
  color: var(--violet);
  cursor: default;
}
.d-btn:not(.center):hover  { background: #1e1e48; color: #aaa; }
.d-btn:not(.center):active { background: #2a2a5a; color: var(--cyan); box-shadow: 0 0 10px var(--cyan); transform: scale(0.9); }

.label-area { font-size: 6px; color: var(--dim); letter-spacing: 1px; text-align: center; }
.btn-row { display: flex; gap: 6px; margin-bottom: 6px; }
.action-buttons { display: flex; flex-direction: column; align-items: flex-end; }

.action-btn {
  width: 28px; height: 28px; border-radius: 50%;
  font-size: 7px; font-family: var(--font-pixel);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: 2px solid rgba(0,0,0,0.3);
  color: #000;
  padding: 0;
  transition: all 60ms;
}
.btn-cyan   { background: var(--cyan);   box-shadow: 0 3px 0 #007a80, 0 0 10px var(--cyan); }
.btn-pink   { background: var(--pink);   box-shadow: 0 3px 0 #7a0055, 0 0 10px var(--pink); }
.btn-gold   { background: var(--gold);   box-shadow: 0 3px 0 #806e00, 0 0 10px var(--gold); }
.btn-violet { background: var(--violet); box-shadow: 0 3px 0 #3a0080, 0 0 10px var(--violet); color: #fff; }

.btn-cyan:active   { transform: translateY(2px); box-shadow: 0 1px 0 #007a80, 0 0 28px var(--cyan),   0 0 8px #fff; filter: brightness(1.4); }
.btn-pink:active   { transform: translateY(2px); box-shadow: 0 1px 0 #7a0055, 0 0 28px var(--pink),   0 0 8px #fff; filter: brightness(1.4); }
.btn-gold:active   { transform: translateY(2px); box-shadow: 0 1px 0 #806e00, 0 0 28px var(--gold),   0 0 8px #fff; filter: brightness(1.4); }
.btn-violet:active { transform: translateY(2px); box-shadow: 0 1px 0 #3a0080, 0 0 28px var(--violet), 0 0 8px #fff; filter: brightness(1.4); color: #fff; }
</style>
