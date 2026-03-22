import { describe, it, expect } from 'vitest';
import {
  moveBall,
  checkPaddleCollision,
  checkBrickCollisions,
  type Ball,
  type Paddle,
  type Brick,
} from '../../../src/components/BreakoutGame.vue';

const makeBall = (overrides: Partial<Ball> = {}): Ball => ({
  x: 200, y: 200, vx: 3, vy: -3, radius: 6, ...overrides,
});
const makePaddle = (overrides: Partial<Paddle> = {}): Paddle => ({
  x: 150, y: 380, width: 80, height: 10, ...overrides,
});
const makeBrick = (overrides: Partial<Brick> = {}): Brick => ({
  x: 0, y: 0, width: 60, height: 20, label: 'React', alive: true, ...overrides,
});

describe('moveBall', () => {
  it('advances ball by velocity', () => {
    const ball = makeBall({ x: 100, y: 100, vx: 3, vy: -3 });
    const next = moveBall(ball, 400, 400);
    expect(next.x).toBe(103);
    expect(next.y).toBe(97);
  });

  it('bounces off left wall', () => {
    const ball = makeBall({ x: 4, vx: -3 });
    const next = moveBall(ball, 400, 400);
    expect(next.vx).toBeGreaterThan(0);
  });

  it('bounces off right wall', () => {
    const ball = makeBall({ x: 396, vx: 3 });
    const next = moveBall(ball, 400, 400);
    expect(next.vx).toBeLessThan(0);
  });

  it('bounces off top wall', () => {
    const ball = makeBall({ y: 4, vy: -3 });
    const next = moveBall(ball, 400, 400);
    expect(next.vy).toBeGreaterThan(0);
  });
});

describe('checkPaddleCollision', () => {
  it('reverses vy when ball hits paddle', () => {
    const ball = makeBall({ x: 190, y: 374, vy: 3 });
    const paddle = makePaddle({ x: 150, y: 380 });
    const next = checkPaddleCollision(ball, paddle);
    expect(next.vy).toBeLessThan(0);
  });

  it('does not reverse vy when ball is above paddle', () => {
    const ball = makeBall({ x: 190, y: 200, vy: 3 });
    const paddle = makePaddle({ x: 150, y: 380 });
    const next = checkPaddleCollision(ball, paddle);
    expect(next.vy).toBeGreaterThan(0);
  });
});

describe('checkBrickCollisions', () => {
  it('kills a brick when ball hits it', () => {
    const ball = makeBall({ x: 30, y: 14, vy: 3 });
    const bricks = [makeBrick({ x: 0, y: 0, width: 60, height: 20 })];
    const { bricks: updated } = checkBrickCollisions(ball, bricks);
    expect(updated[0].alive).toBe(false);
  });

  it('reverses ball vy on brick hit', () => {
    const ball = makeBall({ x: 30, y: 14, vy: 3 });
    const bricks = [makeBrick({ x: 0, y: 0, width: 60, height: 20 })];
    const { ball: updated } = checkBrickCollisions(ball, bricks);
    expect(updated.vy).toBeLessThan(0);
  });

  it('does not affect dead bricks', () => {
    const ball = makeBall({ x: 30, y: 14, vy: 3 });
    const bricks = [makeBrick({ x: 0, y: 0, alive: false })];
    const { bricks: updated } = checkBrickCollisions(ball, bricks);
    expect(updated[0].alive).toBe(false);
  });

  it('reverses vy only once when hitting two adjacent bricks simultaneously', () => {
    const ball = makeBall({ x: 30, y: 14, vy: 3 });
    // Two adjacent bricks both overlapping the ball
    const bricks = [
      makeBrick({ x: 0, y: 0, width: 60, height: 20 }),
      makeBrick({ x: 0, y: 0, width: 60, height: 20 }),
    ];
    const { ball: updated } = checkBrickCollisions(ball, bricks);
    expect(updated.vy).toBeLessThan(0); // negated exactly once, not twice
  });
});
