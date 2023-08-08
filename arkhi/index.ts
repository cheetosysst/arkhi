// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562
// import { ViteNodeServer } from "vite-node/server";

import express from "express";
import compression from "compression";
import { renderPage } from "vite-plugin-ssr";
import { root } from "@/arkhi/root";

import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "@/arkhi/context";
import { getBaseUrl } from "@/arkhi/url";

const isProduction = process.env.NODE_ENV === "production";

startServer();

async function startServer() {
	const app = express();

	app.use(compression());

	if (isProduction) {
		const sirv = (await import("sirv")).default;
		app.use(sirv(`${root}/dist/client`));
	} else {
		const vite = await import("vite");
		// const server = new ViteNodeServer({
		// 	optimizeDeps: {
		// 		// It's recommended to disable deps optimization
		// 		disabled: true,
		// 	},
		// });
		const viteDevMiddleware = (
			await vite.createServer({
				root,
				server: { middlewareMode: true },
			})
		).middlewares;
		app.use(viteDevMiddleware);
	}

	const { appRouter } = await import("@/arkhi/trpc");
	app.use(
		"/trpc",
		trpcExpress.createExpressMiddleware({
			router: appRouter,
			createContext,
		})
	);

	app.get("*", async (req, res, next) => {
		const pageContextInit = {
			urlOriginal: req.originalUrl,
		};
		const pageContext = await renderPage(pageContextInit);
		const { httpResponse } = pageContext;
		if (!httpResponse) return next();
		const { body, statusCode, contentType, earlyHints } = httpResponse;
		if (res.writeEarlyHints)
			res.writeEarlyHints({
				link: earlyHints.map((e) => e.earlyHintLink),
			});
		res.status(statusCode).type(contentType).send(body);
	});

	const port = process.env.PORT || 3000;
	const server = app.listen(port);
	if (import.meta.hot) {
		import.meta.hot.on("vite:beforeFullReload", () => {
			console.log("byebye");
			server.close((temp) => {});
		});
	}

	console.log(`Server running at ${getBaseUrl()}`);
}
