import { injectMiddleware, startServer } from "arkhi/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouters } from "./api/index.js";
import { createContext } from "./api/context.js";

injectMiddleware(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouters,
		createContext,
	})
);

startServer();
