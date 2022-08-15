// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { topicRouter } from "./topic";
import { flashcardRouter } from "./flashcard";
import { publicRouter } from "./public";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("question.", protectedExampleRouter)
  .merge("topic.", topicRouter)
  .merge("flashcard.", flashcardRouter)
  .merge("public.", publicRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
