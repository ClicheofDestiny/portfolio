import { defineCollection } from 'astro:content';
import { blogSchema } from './schema';

const blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

export const collections = { blog };
