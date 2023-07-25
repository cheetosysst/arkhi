import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import { getBaseUrl } from "../url";
import type { AppRouter } from "../trpc";

export const trpc = createTRPCProxyClient<AppRouter>({
	transformer: SuperJSON,
	links: [
		httpBatchLink({
			url: `${getBaseUrl()}/trpc`,
		}),
	],
});
