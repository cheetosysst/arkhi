import type { AppRouters } from "@/api";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

/**
 * Checks current enviroment and returns current base URL.
 * Copied from T3.
 * @returns Base URL
 */
const getBaseUrl = () => {
	if (typeof window !== "undefined") return "";
	// TODO add more edge runtime options.
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
};

/**
 * Info: https://trpc.io/docs/client/nextjs/server-side-helpers#2-external-router
 */
export const api = createTRPCProxyClient<AppRouters>({
	links: [
		httpBatchLink({
			url: `${getBaseUrl()}/trpc`,
		}),
	],
});
