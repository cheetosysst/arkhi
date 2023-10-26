import { injectMiddleware, startServer } from "./arkhi/server/index.js";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouters } from "./api/index.js";
import { createContext } from "./api/context.js";
import remarkGfm from "remark-gfm";
import { injectMDXPlugins } from "./arkhi/plugins/cms.js";

injectMDXPlugins("remark", [remarkGfm]);

injectMiddleware(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouters,
		createContext,
	})
);

startServer();
