import type { Express, RequestHandler } from "express";

const customMiddlewares: Array<RequestHandler | [string, RequestHandler]> = [];

export function injectMiddleware(middleware: RequestHandler): void;
export function injectMiddleware(
	path: string,
	middleware: RequestHandler
): void;
export function injectMiddleware(
	arg1: string | RequestHandler,
	middleware?: RequestHandler
) {
	if (typeof arg1 === "string") {
		customMiddlewares.push([arg1, middleware!]);
		return;
	}
	customMiddlewares.push(arg1);
}

export function applyMiddleware(app: Express) {
	customMiddlewares.forEach((middleware) => {
		if (Array.isArray(middleware)) {
			const [path, item] = middleware;
			app.use(path, item);
			return;
		}
		app.use(middleware);
	});
}
