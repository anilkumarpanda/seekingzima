import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()),
    artSeed: z.number(),
  }),
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tech: z.array(z.string()),
    status: z.enum(['live', 'building', 'archived']),
    demoUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    artSeed: z.number(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    date: z.coerce.date(),
  }),
});

export const collections = { writing, lab, notes };
