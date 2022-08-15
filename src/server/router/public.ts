import { createRouter } from "./context";
import { z } from "zod";

export const publicRouter = createRouter().query("getPublicTopics", {
  async resolve({ ctx }) {
    const topics = await ctx.prisma.topic.findMany({ where: { public: true } });

    return topics;
  },
});
