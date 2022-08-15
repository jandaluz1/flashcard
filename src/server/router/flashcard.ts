import { createProtectedRouter } from "./protected-router";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const flashcardRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      question: z.string(),
      answer: z.string(),
      topicId: z.string().nullish(),
      ownerId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.flashcards.create({ data: input });
    },
  })
  .query("getUserCards", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const cards = await ctx.prisma.flashcards.findMany({
        where: {
          ownerId: input.id,
        },
      });
      return cards;
    },
  });
