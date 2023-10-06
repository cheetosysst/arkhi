import { initTRPC } from "@trpc/server";
import { TRPCContext } from "./context.js";
import superjson from "superjson";

const t = initTRPC.context<TRPCContext>().create({
	transformer: superjson,
});

/**
 * You can add authentication-required procedures here.
 * Info: https://trpc.io/docs/server/metadata#example-with-per-route-authentication-settings
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
