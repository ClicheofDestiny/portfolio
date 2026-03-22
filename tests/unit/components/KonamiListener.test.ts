import { describe, it, expect } from 'vitest';
import { isKonamiComplete, KONAMI_SEQUENCE } from '../../../src/components/KonamiListener.vue';

describe('Konami sequence detection', () => {
  it('returns false for incomplete sequence', () => {
    const partial = KONAMI_SEQUENCE.slice(0, 5);
    expect(isKonamiComplete(partial)).toBe(false);
  });

  it('returns true for exact sequence', () => {
    expect(isKonamiComplete([...KONAMI_SEQUENCE])).toBe(true);
  });

  it('returns false for wrong sequence', () => {
    const wrong = [...KONAMI_SEQUENCE];
    wrong[0] = 'ArrowDown';
    expect(isKonamiComplete(wrong)).toBe(false);
  });

  it('matches after preceding noise keys (sliding window)', () => {
    // Simulate the buffer slicing behavior: noise keys followed by the full sequence
    const noise = ['x', 'y', 'z', 'Enter', 'Escape'];
    const fullInput = [...noise, ...KONAMI_SEQUENCE];
    // The buffer keeps only the last N keys (KONAMI_SEQUENCE.length)
    const buffer = fullInput.slice(-KONAMI_SEQUENCE.length);
    expect(isKonamiComplete(buffer)).toBe(true);
  });
});
