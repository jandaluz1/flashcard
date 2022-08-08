import { createProtectedRouter } from "./protected-router";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const topicRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      name: z.string(),
      description: z.string().nullish(),
      public: z.boolean(),
      ownerId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.topic.create({ data: input });
    },
  })
  .query("getUserTopics", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const res = await ctx.prisma.topic.findMany({
        where: { ownerId: input.userId },
      });
      return res;
    },
  });
