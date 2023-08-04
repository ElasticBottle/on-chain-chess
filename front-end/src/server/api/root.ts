import { web3ApiRouter } from "~/server/api/routers/queries";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  web3api: web3ApiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
