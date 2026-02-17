import { defineCollection, z } from 'astro:content';

const quizCollection = defineCollection({
  type: 'data',
  schema: z.object({
    meta: z.object({
      id: z.string(),
      date: z.string(),
      topic: z.string(),
      category: z.enum(['tech', 'science', 'history', 'pop-culture', 'sports', 'general']),
      difficulty: z.enum(['easy', 'medium', 'hard']),
    }),
    questions: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
        options: z.array(
          z.object({
            text: z.string(),
            correct: z.boolean(),
          })
        ),
        explanation: z.string(),
        points: z.number().optional().default(100),
      })
    ),
  }),
});

export const collections = {
  quizzes: quizCollection,
};
