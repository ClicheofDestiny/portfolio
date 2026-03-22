<script lang="ts">
// ── Types ────────────────────────────────────────────────────────
export interface Ball   { x: number; y: number; vx: number; vy: number; radius: number; }
export interface Paddle { x: number; y: number; width: number; height: number; }
export interface Brick  { x: number; y: number; width: number; height: number; label: string; alive: boolean; }

// ── Pure game logic (exported for testing) ───────────────────────
export function moveBall(ball: Ball, W: number, H: number): Ball {
  let { x, y, vx, vy } = ball;
  x += vx; y += vy;
  if (x - ball.radius <= 0)  { x = ball.radius;      vx = Math.abs(vx); }
  if (x + ball.radius >= W)  { x = W - ball.radius;  vx = -Math.abs(vx); }
  if (y - ball.radius <= 0)  { y = ball.radius;       vy = Math.abs(vy); }
  return { ...ball, x, y, vx, vy };
}

export function checkPaddleCollision(ball: Ball, paddle: Paddle): Ball {
  const inX = ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width;
  const inY = ball.y + ball.radius >= paddle.y && ball.y + ball.radius <= paddle.y + paddle.height + ball.radius;
  if (inX && inY && ball.vy > 0) {
    return { ...ball, vy: -Math.abs(ball.vy) };
  }
  return ball;
}

export function checkBrickCollisions(ball: Ball, bricks: Brick[]): { ball: Ball; bricks: Brick[] } {
  let newBall = { ...ball };
  let reversed = false;
  const newBricks = bricks.map(brick => {
    if (!brick.alive) return brick;
    const hit =
      ball.x + ball.radius > brick.x &&
      ball.x - ball.radius < brick.x + brick.width &&
      ball.y + ball.radius > brick.y &&
      ball.y - ball.radius < brick.y + brick.height;
    if (hit) {
      if (!reversed) {
        newBall = { ...newBall, vy: -newBall.vy };
        reversed = true;
      }
      return { ...brick, alive: false };
    }
    return brick;
  });
  return { ball: newBall, bricks: newBricks };
}
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// ── Component ────────────────────────────────────────────────────
const emit = defineEmits<{ dismiss: [] }>();

const SKILLS = ['React', 'Vue', 'TypeScript', 'Go', 'AWS', 'K8s', 'Python', 'SQL', 'Rust', 'Docker', 'Node', 'Git'];
const W = 400, H = 400;
const PADDLE_W = 80, PADDLE_H = 10;
const BALL_R = 6;
const BRICK_COLS = 4, BRICK_ROWS = 3, BRICK_W = 80, BRICK_H = 24, BRICK_PAD = 10;

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const won = ref(false);
let animFrame = 0;

let ball: Ball   = { x: W/2, y: H/2, vx: 3, vy: -3, radius: BALL_R };
let paddle: Paddle = { x: (W - PADDLE_W)/2, y: H - 30, width: PADDLE_W, height: PADDLE_H };
let bricks: Brick[] = [];

function initBricks() {
  bricks = [];
  let idx = 0;
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: BRICK_PAD + c * (BRICK_W + BRICK_PAD),
        y: 40 + r * (BRICK_H + BRICK_PAD),
        width: BRICK_W, height: BRICK_H,
        label: SKILLS[idx++ % SKILLS.length],
        alive: true,
      });
    }
  }
}

function draw(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#00000f';
  ctx.fillRect(0, 0, W, H);

  // Bricks
  bricks.forEach(b => {
    if (!b.alive) return;
    ctx.fillStyle = '#7b2fff33';
    ctx.strokeStyle = '#7b2fff';
    ctx.lineWidth = 1;
    ctx.fillRect(b.x, b.y, b.width, b.height);
    ctx.strokeRect(b.x, b.y, b.width, b.height);
    ctx.fillStyle = '#2fffff';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(b.label, b.x + b.width/2, b.y + b.height/2 + 3);
  });

  // Paddle
  ctx.fillStyle = '#ff2faa';
  ctx.shadowColor = '#ff2faa';
  ctx.shadowBlur = 10;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.shadowBlur = 0;

  // Ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#2fffff';
  ctx.shadowColor = '#2fffff';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;

  // ESC hint
  ctx.fillStyle = '#3a3a6a';
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('[ESC] EXIT', 6, H - 6);
}

function loop() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ball = moveBall(ball, W, H);
  ball = checkPaddleCollision(ball, paddle);
  const result = checkBrickCollisions(ball, bricks);
  ball = result.ball;
  bricks = result.bricks;

  // Ball fell below screen
  if (ball.y - ball.radius > H) {
    ball = { x: W/2, y: H/2, vx: 3, vy: -3, radius: BALL_R };
  }

  draw(ctx);

  // All bricks cleared
  if (bricks.every(b => !b.alive)) {
    won.value = true;
    return;
  }
  animFrame = requestAnimationFrame(loop);
}

function handleMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  paddle.x = Math.max(0, Math.min(W - paddle.width, x - paddle.width / 2));
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('dismiss');
  if (e.key === 'ArrowLeft')  paddle.x = Math.max(0, paddle.x - 15);
  if (e.key === 'ArrowRight') paddle.x = Math.min(W - paddle.width, paddle.x + 15);
}

onMounted(() => {
  ball = { x: W/2, y: H/2, vx: 3, vy: -3, radius: BALL_R };
  paddle = { x: (W - PADDLE_W)/2, y: H - 30, width: PADDLE_W, height: PADDLE_H };
  initBricks();
  containerRef.value?.focus();
  window.addEventListener('keydown', handleKeydown);
  animFrame = requestAnimationFrame(loop);
});

onUnmounted(() => {
  cancelAnimationFrame(animFrame);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="breakout-overlay" role="dialog" aria-modal="true" aria-label="Bonus Stage: Breakout" @click.self="$emit('dismiss')">
    <div ref="containerRef" class="breakout-container" tabindex="-1">
      <div class="breakout-header text-xxs glow-pink">★ BONUS STAGE ★</div>
      <div v-if="won" class="win-screen text-xs">
        <p class="glow-gold">YOU WIN!</p>
        <p class="win-msg">You cleared the stack.</p>
        <p class="win-msg">Now go ship something.</p>
        <button @click="$emit('dismiss')" class="win-btn text-xxs">← BACK</button>
      </div>
      <canvas
        v-else
        ref="canvasRef"
        :width="W"
        :height="H"
        @mousemove="handleMouseMove"
      />
    </div>
  </div>
</template>

<style scoped>
.breakout-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.breakout-container {
  border: 2px solid var(--violet);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(123,45,255,0.4);
}
.breakout-header {
  background: var(--violet);
  color: #000;
  text-align: center;
  padding: 6px;
  letter-spacing: 2px;
}
canvas { display: block; cursor: none; }
.win-screen {
  background: #00000f;
  width: 400px; height: 400px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 4px;
}
.win-msg { color: var(--dim); margin-top: 8px; }
.win-btn {
  margin-top: 16px;
  background: none;
  border: 1px solid var(--violet);
  color: var(--violet);
  font-family: var(--font-pixel);
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 3px;
}
.win-btn:hover { background: rgba(123,45,255,0.1); }
</style>
