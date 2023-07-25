import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
});

export const publicProcedure = t.procedure;
export const createTRPCRouter = t.router;

const apis = (await import("@/api/index")).default;

export const appRouter = t.router(apis);
export type AppRouter = typeof appRouter;
