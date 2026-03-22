import { describe, it, expect } from 'vitest';
import { siteConfig } from '../../../src/config/site';

describe('siteConfig', () => {
  it('has a name', () => {
    expect(siteConfig.name).toBeTypeOf('string');
    expect(siteConfig.name.length).toBeGreaterThan(0);
  });

  it('has high score entries with numeric values', () => {
    expect(siteConfig.highScores).toHaveLength(3);
    siteConfig.highScores.forEach(entry => {
      expect(entry.label).toBeTypeOf('string');
      expect(entry.value).toBeTypeOf('string');
    });
  });

  it('has nav items with label and href', () => {
    expect(siteConfig.nav.length).toBeGreaterThan(0);
    siteConfig.nav.forEach(item => {
      expect(item.label).toBeTypeOf('string');
      expect(item.href).toMatch(/^\//);
    });
  });
});
