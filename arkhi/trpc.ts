import { initTRPC } from "@trpc/server";
import { TRPCContext } from "./context";
// import SuperJSON from "superjson";

const t = initTRPC.context<TRPCContext>().create();

/**
 * You can add authentication-required procedures here.
 * Info: https://trpc.io/docs/server/metadata#example-with-per-route-authentication-settings
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
