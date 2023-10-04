import compression from "compression";
import express from "express";
import { renderPage } from "vike/server";
import { applyMiddleware } from "./middleware.js";
import * as trpcExpress from "@trpc/server/adapters/express";

const isProduction = process.env.NODE_ENV === "production";

export async function startServer() {
	const app = express();
	const root = process.cwd();

	app.use(compression());

	if (isProduction) {
		const sirv = (await import("sirv")).default;
		app.use(sirv(`${root}/dist/client`));
	} else {
		const vite = await import("vite");
		const viteDevMiddleware = (
			await vite.createServer({
				root,
				server: { middlewareMode: true },
			})
		).middlewares;
		app.use(viteDevMiddleware);
	}

	applyMiddleware(app);

	// app.use(
	// 	"/trpc",
	// 	trpcExpress.createExpressMiddleware({
	// 		router: appRouters,
	// 		createContext,
	// 	})
	// );

	app.get("*", async (req, res, next) => {
		const pageContextInit = {
			urlOriginal: req.originalUrl,
		};
		const pageContext = await renderPage(pageContextInit);
		const { httpResponse } = pageContext;
		if (!httpResponse) return next();

		const { body, statusCode, headers, earlyHints } = httpResponse;
		if (res.writeEarlyHints) {
			res.writeEarlyHints({
				link: earlyHints.map((e) => e.earlyHintLink),
			});
		}
		headers.forEach(([name, value]) => res.setHeader(name, value));
		res.status(statusCode);
		res.send(body);
	});

	const port = process.env.PORT || 3000;
	app.listen(port);
	console.log(`Server running at http://localhost:${port}`);
}
