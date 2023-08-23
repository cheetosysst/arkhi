import type { AppRouters } from "@/api";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

/**
 * Info: https://trpc.io/docs/client/nextjs/server-side-helpers#2-external-router
 */
export const api = createTRPCProxyClient<AppRouters>({
	links: [
		httpBatchLink({
			url: `http://localhost:3000/trpc`,
		}),
	],
});
