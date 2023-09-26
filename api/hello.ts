import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "./trpc.js";

/**
 * Example router
 * Try calling this router in frontend using `api.hello.hello.useQuery()`.
 */
export const helloRouter = createTRPCRouter({
	hello: publicProcedure.input(z.string()).query(({ input }) => {
		return {
			message: `hello ${input}`,
		};
	}),
});
