import { describe, it, expect } from 'vitest';
import { blogSchema } from '../../../src/content/schema';

describe('blogSchema', () => {
  it('accepts valid frontmatter', () => {
    const result = blogSchema.safeParse({
      title: 'Test Post',
      date: new Date('2026-01-01'),
      stage: 1,
      published: true,
      category: 'leadership',
      xp: 100,
      excerpt: 'A short excerpt.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = blogSchema.safeParse({ title: 'No stage' });
    expect(result.success).toBe(false);
  });

  it('rejects non-positive stage number', () => {
    const result = blogSchema.safeParse({
      title: 'Bad stage',
      date: new Date(),
      stage: 0,
      published: true,
      category: 'leadership',
      xp: 100,
      excerpt: 'Excerpt.',
    });
    expect(result.success).toBe(false);
  });
});
