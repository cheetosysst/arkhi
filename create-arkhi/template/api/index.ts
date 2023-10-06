import { createTRPCRouter } from "#/api/trpc.js";
import { helloRouter } from "#/api/hello.js";

/**
 * Default router entry point.
 * Info: https://trpc.io/docs/server/routers#defining-a-router
 */
export const appRouters = createTRPCRouter({
	hello: helloRouter,
});

export type AppRouters = typeof appRouters;
