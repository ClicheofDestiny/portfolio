import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string(),
  date: z.date(),
  stage: z.number().int().positive(),
  published: z.boolean(),
  category: z.string(),
  xp: z.number().int().positive(),
  excerpt: z.string(),
});
